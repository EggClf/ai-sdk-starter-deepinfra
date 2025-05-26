import { google } from "@ai-sdk/google";
import {
  customProvider,
  extractReasoningMiddleware,
  wrapLanguageModel,
} from "ai";

const languageModels = {
  "gemini-2.5-flash-preview-05-20": google("gemini-2.5-flash-preview-05-20"),
  "gemini-2.0-flash": google("gemini-2.0-flash"),
};

export const model = customProvider({
  languageModels,
});

export type modelID = keyof typeof languageModels;

export const MODELS = Object.keys(languageModels);

export const defaultModel: modelID = "gemini-2.0-flash";
