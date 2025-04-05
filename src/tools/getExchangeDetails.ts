import { z } from "zod";

const COINCAP_API_BASE = "https://api.coincap.io/v2";

interface ExchangeData {
  exchangeId: string;
  name: string;
  rank: string;
  percentTotalVolume: string;
  volumeUsd: string;
  tradingPairs: string;
  socket: boolean;
  exchangeUrl: string;
  updated: number;
}

interface ExchangeResponse {
  data: ExchangeData;
  timestamp: number;
}

// Make API request to CoinCap
async function makeCoinCapRequest<T>(url: string): Promise<T | null> {
  const headers = {
    Accept: "application/json",
  };

  try {
    const response = await fetch(url, { headers });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return (await response.json()) as T;
  } catch (error) {
    console.error("Error making CoinCap request:", error);
    return null;
  }
}

// Format exchange details
function formatExchangeDetails(data: ExchangeData): string {
  return [
    `Name: ${data.name || "Unknown"}`,
    `Rank: ${data.rank || "Unknown"}`,
    `Volume (USD): $${parseFloat(data.volumeUsd).toLocaleString() || "Unknown"}`,
    `% of Total Volume: ${parseFloat(data.percentTotalVolume).toFixed(2)}%`,
    `Trading Pairs: ${data.tradingPairs || "Unknown"}`,
    `Website: ${data.exchangeUrl || "Unknown"}`,
    `Last Updated: ${new Date(data.updated).toLocaleString()}`,
  ].join("\n");
}

// Tool definition for "get-exchange-details"
export const getExchangeDetailsTool = {
  name: "get-exchange-details",
  description: "Get details about a cryptocurrency exchange",
  inputSchema: z.object({
    exchange: z.string().describe("Exchange ID (e.g., binance, coinbase, kraken)"),
  }).shape,
  execute: async (args: { exchange: string }, extra: any) => {
    try {
      const exchangeId = args.exchange.toLowerCase();
      const exchangeUrl = `${COINCAP_API_BASE}/exchanges/${exchangeId}`;
      const exchangeData = await makeCoinCapRequest<ExchangeResponse>(exchangeUrl);

      if (!exchangeData || !exchangeData.data) {
        return {
          content: [
            {
              type: "text" as const,
              text: `Failed to retrieve details for exchange: ${exchangeId}`,
            },
          ],
        };
      }

      const formattedDetails = formatExchangeDetails(exchangeData.data);
      const detailsText = `Exchange details for ${exchangeData.data.name}:\n\n${formattedDetails}`;

      return {
        content: [
          {
            type: "text" as const,
            text: detailsText,
          },
        ],
      };
    } catch (error) {
      console.error("Error in getExchangeDetailsTool.execute:", error);
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