import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';
export const ai = apiKey ? new GoogleGenAI({ apiKey, apiVersion: "v1beta" }) : null;

export const MODELS = {
  GEMINI_FLASH: "gemini-3-flash-preview",
};
