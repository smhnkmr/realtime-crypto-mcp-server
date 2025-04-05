import { z } from "zod";

const COINCAP_API_BASE = "https://api.coincap.io/v2";

interface RateData {
  id: string;
  symbol: string;
  currencySymbol: string;
  type: string;
  rateUsd: string;
}

interface RateResponse {
  data: RateData;
  timestamp: number;
}

// Make API request to CoinCap with rate limiting and retries
async function makeCoinCapRequest<T>(url: string): Promise<T | null> {
  const USER_AGENT = "realtime-crypto-app/1.0";
  const MAX_RETRIES = 3;
  const RETRY_DELAY = 1000; // 1 second
  
  const headers = {
    "User-Agent": USER_AGENT,
    Accept: "application/json",
  };

  let retries = 0;
  
  while (retries <= MAX_RETRIES) {
    try {
      const response = await fetch(url, { headers });
      
      if (response.status === 429) {
        // Rate limited - wait and retry
        retries++;
        console.log(`Rate limited by CoinCap API. Retry attempt ${retries}/${MAX_RETRIES} after ${RETRY_DELAY}ms delay`);
        
        if (retries <= MAX_RETRIES) {
          await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * retries));
          continue;
        } else {
          throw new Error("Rate limit exceeded. Maximum retries reached.");
        }
      }
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return (await response.json()) as T;
    } catch (error) {
      if (retries >= MAX_RETRIES || (error instanceof Error && !error.message.includes("429"))) {
        console.error("Error making CoinCap request:", error);
        return null;
      }
      
      retries++;
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * retries));
    }
  }
  
  return null;
}

// Format rate details
function formatRateDetails(data: RateData): string {
  return [
    `Symbol: ${data.symbol || "Unknown"} ${data.currencySymbol || ""}`,
    `Type: ${data.type || "Unknown"}`,
    `USD Rate: $${parseFloat(data.rateUsd).toLocaleString(undefined, { maximumFractionDigits: 2 })}`,
  ].join("\n");
}

// Tool definition for "get-rates"
export const getRatesTool = {
  name: "get-rates",
  description: "Get exchange rates for a cryptocurrency",
  inputSchema: z.object({
    currency: z.string().describe("Cryptocurrency ID (e.g., bitcoin, ethereum, litecoin)"),
  }).shape,
  execute: async (args: { currency: string }, extra: any) => {
    try {
      const currencyId = args.currency.toLowerCase();
      const rateUrl = `${COINCAP_API_BASE}/rates/${currencyId}`;
      const rateData = await makeCoinCapRequest<RateResponse>(rateUrl);

      if (!rateData || !rateData.data) {
        return {
          content: [
            {
              type: "text" as const,
              text: `Failed to retrieve rates for currency: ${currencyId}`,
            },
          ],
        };
      }

      const formattedDetails = formatRateDetails(rateData.data);
      const rateText = `Current rate for ${rateData.data.id}:\n\n${formattedDetails}`;

      return {
        content: [
          {
            type: "text" as const,
            text: rateText,
          },
        ],
      };
    } catch (error) {
      console.error("Error in getRatesTool.execute:", error);
      return {
        content: [
          {
            type: "text" as const,
            text: `Error: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
        isError: true,
      };
    }
  },
};