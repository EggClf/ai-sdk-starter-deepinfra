import { tool } from "ai";
import { z } from "zod";

export const weatherTool = tool({
  description: "Get the weather in a location",
  parameters: z.object({
    location: z.string().describe("The location to get the weather for"),
  }),
  execute: async ({ location }) => ({
    location,
    temperature: 72 + Math.floor(Math.random() * 21) - 10,
  }),
});

export const BITool = tool({
  description: "Get data from a BI tool",
  parameters: z.object({
    query: z
      .string()
      .describe(
        'The query to get data from the BI tool, you only accept SELECT queries, and note that table name follow this format: `public."table_name"`. '
      ),
  }),
  execute: async ({ query }) => {
    try {
      // Make a request to the /api/bi endpoint
      const response = await fetch("http://localhost:3000/api/bi", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `BI Tool Error: ${errorData.error || "Failed to fetch data"}`
        );
      }

      const result = await response.json();
      return {
        columns: result.columns || [],
        records: result.records || [],
        // Include raw result for debugging or additional processing
        rawResult: result,
      };
    } catch (error) {
      console.error("Error using BI Tool:", error);
      return {
        error: `Failed to fetch data: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        columns: [],
        records: [],
      };
    }
  },
});

export const RAGTool = tool({
  description:
    "Retrieve context from vector store based on the provided query.",
  parameters: z.object({
    query: z.string().describe("The query to get data from the RAG tool"),
  }),
  execute: async ({ query }) => {
    try {
      // Make a request to the /api/rag endpoint
      const response = await fetch("http://localhost:3000/api/rag", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `RAG Tool Error: ${errorData.error || "Failed to fetch data"}`
        );
      }

      const result = await response.json();
      return {
        documents: result.documents || [],
        rawResult: result,
      };
    } catch (error) {
      console.error("Error using RAG Tool:", error);
      return {
        error: `Failed to fetch data: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        documents: [],
      };
    }
  },
});
