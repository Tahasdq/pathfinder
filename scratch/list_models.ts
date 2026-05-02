import { GoogleGenAI } from "@google/genai";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";
const ai = new GoogleGenAI({ apiKey });

async function listModels() {
  try {
    console.log("Checking available models for your API key...");
    const response = await ai.models.list();
    console.log("Full Response:", JSON.stringify(response, null, 2));
  } catch (err: any) {
    console.error("Error listing models:", err.message);
  }
}

listModels();
