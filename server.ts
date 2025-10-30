import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import express from "express";
import { z } from "zod";

/**
 * reference
 * https://www.npmjs.com/package/@modelcontextprotocol/sdk
 */

// Create an MCP server
const server = new McpServer({
  name: "demo-server",
  version: "1.0.0",
});

// Add an addition tool
server.registerTool(
  "add",
  {
    title: "Addition Tool",
    description: "Add two numbers",
    inputSchema: { a: z.number(), b: z.number() },
    outputSchema: { result: z.number() },
  },
  async ({ a, b }) => {
    const output = { result: a + b };
    return {
      content: [{ type: "text", text: JSON.stringify(output) }],
      structuredContent: output,
    };
  }
);

/**
 * registerResource
 */

// Add a dynamic greeting resource
server.registerResource(
  "greeting",
  new ResourceTemplate("greeting://{name}", { list: undefined }),
  {
    title: "Greeting Resource", // Display name for UI
    description: "Dynamic greeting generator",
  },
  async (uri, { name }) => {
    console.log("greeting", name, uri.href);
    return {
      contents: [
        {
          uri: uri.href,
          text: `Hello, ${name}!`,
        },
      ],
    };
  }
);

// Static resource
server.registerResource(
  "config",
  "config://app",
  {
    title: "Application Config",
    description: "Application configuration data",
    mimeType: "text/plain",
  },
  async (uri) => ({
    contents: [
      {
        uri: uri.href,
        text: "App configuration here",
      },
    ],
  })
);

// Dynamic resource with parameters
server.registerResource(
  "user-profile",
  new ResourceTemplate("users://{userId}/profile", { list: undefined }),
  {
    title: "User Profile",
    description: "User profile information",
  },
  async (uri, { userId }) => ({
    contents: [
      {
        uri: uri.href,
        text: `Profile data for user ${userId}`,
      },
    ],
  })
);

// Resource with context-aware completion
server.registerResource(
  "repository",
  new ResourceTemplate("github://repos/{owner}/{repo}", {
    list: undefined,
    complete: {
      // Provide intelligent completions based on previously resolved parameters
      repo: (value, context) => {
        if (context?.arguments?.["owner"] === "org1") {
          return ["project1", "project2", "project3"].filter((r) => r.startsWith(value));
        }
        return ["default-repo"].filter((r) => r.startsWith(value));
      },
    },
  }),
  {
    title: "GitHub Repository",
    description: "Repository information",
  },
  async (uri, { owner, repo }) => ({
    contents: [
      {
        uri: uri.href,
        text: `Repository: ${owner}/${repo}`,
      },
    ],
  })
);

server.registerResource(
  "test-query",
  new ResourceTemplate("data://{query}", { list: undefined }),
  {
    title: "Test Query",
    description: "Test Query Parameter",
  },
  async (uri, { query }) => {
    console.log("query", query, uri.href);
    return {
      contents: [
        {
          uri: uri.href,
          text: `query length: ${query.length}`,
        },
      ],
    };
  }
);

/**
 * registerResource
 */

// Set up Express and HTTP transport
const app = express();
app.use(express.json());

app.post("/mcp", async (req, res) => {
  // Create a new transport for each request to prevent request ID collisions
  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
    enableJsonResponse: true,
  });

  res.on("close", () => {
    transport.close();
  });

  await server.connect(transport);
  await transport.handleRequest(req, res, req.body);
});

const port = parseInt(process.env.PORT || "3000");
app
  .listen(port, () => {
    console.log(`Demo MCP Server running on http://localhost:${port}/mcp`);
  })
  .on("error", (error) => {
    console.error("Server error:", error);
    process.exit(1);
  });
