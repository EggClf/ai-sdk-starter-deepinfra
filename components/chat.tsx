"use client";

import { defaultModel, modelID } from "@/ai/providers";
import { useChat } from "@ai-sdk/react";
import { useState } from "react";
import { Textarea } from "./textarea";
import { ProjectOverview } from "./project-overview";
import { Messages } from "./messages";
import { Header } from "./header";
import { toast } from "sonner";
import { DataTable } from "./table-result";

const exampleBIData = {
  title: "Sales Performance Q1 2025",
  columns: ["Region", "Product", "Revenue", "Units", "Growth"],
  records: [
    {
      Region: "North",
      Product: "Smartphone X",
      Revenue: "$1,245,000",
      Units: 2490,
      Growth: "12.3%",
    },
    {
      Region: "South",
      Product: "Laptop Pro",
      Revenue: "$980,500",
      Units: 1200,
      Growth: "8.7%",
    },
    {
      Region: "East",
      Product: "Tablet Mini",
      Revenue: "$650,750",
      Units: 3100,
      Growth: "15.2%",
    },
    {
      Region: "West",
      Product: "Smartphone X",
      Revenue: "$1,340,200",
      Units: 2680,
      Growth: "10.1%",
    },
    {
      Region: "Central",
      Product: "Smartwatch",
      Revenue: "$410,300",
      Units: 2050,
      Growth: "22.5%",
    },
  ],
};

export default function Chat() {
  const [selectedModel, setSelectedModel] = useState<modelID>(defaultModel);
  const { messages, input, handleInputChange, handleSubmit, status, stop } =
    useChat({
      maxSteps: 5,
      body: {
        selectedModel,
      },
      onError: (error) => {
        toast.error(
          error.message.length > 0
            ? error.message
            : "An error occured, please try again later.",
          { position: "top-center", richColors: true }
        );
      },
    });

  const isLoading = status === "streaming" || status === "submitted";

  // Process messages to find BI tool results
  const processedMessages = messages.map((message) => {
    if (message.role === "assistant" && message.parts) {
      return {
        ...message,
        parts: message.parts.map((part) => {
          if (part.type === "tool-invocation") {
            const { toolInvocation } = part;
            const { toolName, state } = toolInvocation;
            if (toolName === "getDataBI" && state === "result") {
              const biResult = toolInvocation.result;

              // If result contains columns and records, render as DataTable
              if (biResult && biResult.columns && biResult.records) {
                console.log("true");
                return {
                  ...part,
                  toolInvocation: {
                    ...toolInvocation,
                    customRenderer: (
                      <div className="w-1/2 max-w-xl mx-auto ">
                        <DataTable
                          data={{
                            title: "BI Query Results",
                            columns: biResult.columns,
                            records: biResult.records,
                          }}
                        />
                      </div>
                    ),
                  },
                };
              }
            }
          }
          return part;
        }),
      };
    }
    return message;
  });

  return (
    <div className="h-dvh flex flex-col justify-center w-full stretch">
      <Header />
      {messages.length === 0 ? (
        <div className="max-w-xl mx-auto w-full">
          <ProjectOverview />
        </div>
      ) : (
        <Messages
          messages={processedMessages}
          isLoading={isLoading}
          status={status}
        />
      )}
      <form
        onSubmit={handleSubmit}
        className="pb-8 bg-white dark:bg-black w-full max-w-xl mx-auto px-4 sm:px-0"
      >
        <Textarea
          selectedModel={selectedModel}
          setSelectedModel={setSelectedModel}
          handleInputChange={handleInputChange}
          input={input}
          isLoading={isLoading}
          status={status}
          stop={stop}
        />
      </form>
    </div>
  );
}
