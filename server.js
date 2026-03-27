import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  ListToolsRequestSchema,
  CallToolRequestSchema
} from "@modelcontextprotocol/sdk/types.js";

const server = new Server(
  {
    name: "local-mcp",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

//
// 🔧 Tools list
//
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "execute_sql",
        description: "Execute SQL query on MariaDB",
        inputSchema: {
          type: "object",
          properties: {
            query: { type: "string" },
          },
          required: ["query"],
        },
      },
      {
        name: "call_api",
        description: "Call external API",
        inputSchema: {
          type: "object",
          properties: {
            url: { type: "string" },
          },
          required: ["url"],
        },
      },
      {
        name: "get_latest_otp",
        description: "Fetch latest OTP from log file",
        inputSchema: { type: "object", properties: {} },
      },
      {
        name: "get_schema",
        description: "Get table schema",
        inputSchema: { type: "object", properties: {} },
      },
      {
        name: "get_latest_audit",
        description: "Get latest audit records",
        inputSchema: { type: "object", properties: {} },
      },
      {
        name: "execute_git",
        description: "Run safe git command",
        inputSchema: {
          type: "object",
          properties: {
            command: { type: "string" },
          },
          required: ["command"],
        },
      },
      {
        name: "get_live_log",
        description: "Tail log file",
        inputSchema: { type: "object", properties: {} },
      },
      {
        name: "read_properties",
        description: "Read Spring Boot application properties (YAML)",
        inputSchema: { type: "object", properties: {} },
      },
    ],
  };
});

//
// ⚙️ Tool execution
//
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  switch (name) {
    case "execute_sql":
      return {
        content: [
          {
            type: "text",
            text: `Executing SQL: ${args.query}`,
          },
        ],
      };

    case "call_api":
      return {
        content: [
          {
            type: "text",
            text: `Calling API: ${args.url}`,
          },
        ],
      };

    case "get_latest_otp":
      return {
        content: [{ type: "text", text: "OTP: 123456 (mock)" }],
      };

    case "get_schema":
      return {
        content: [{ type: "text", text: "Schema: mock_schema" }],
      };

    case "get_latest_audit":
      return {
        content: [{ type: "text", text: "Audit logs: mock_data" }],
      };

    case "execute_git":
      return {
        content: [
          {
            type: "text",
            text: `Running git command: ${args.command}`,
          },
        ],
      };

    case "get_live_log":
      return {
        content: [{ type: "text", text: "Streaming logs..." }],
      };

    case "read_properties":
      return {
        content: [{ type: "text", text: "properties: mock_yaml" }],
      };

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
});

//
// 🚀 Start MCP server
//
const transport = new StdioServerTransport();
await server.connect(transport);