import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';
export const ai = new GoogleGenAI({ apiKey, apiVersion: "v1beta" });

export const MODELS = {
  GEMINI_FLASH: "gemini-3-flash-preview",
};
