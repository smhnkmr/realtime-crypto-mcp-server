import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { getExchangeDetailsTool } from "./tools/getExchangeDetails.js";
import { getRatesTool } from "./tools/getRates.js";

const server = new McpServer({
  name: "realtime-crypto",
  version: "1.0.0",
  capabilities: {
    resources: {},
    tools: {},
  },
});

// Register crypto tools
server.tool(
  getExchangeDetailsTool.name,
  getExchangeDetailsTool.description,
  getExchangeDetailsTool.inputSchema,
  getExchangeDetailsTool.execute
);

server.tool(
  getRatesTool.name,
  getRatesTool.description,
  getRatesTool.inputSchema,
  getRatesTool.execute
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Realtime Crypto MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});