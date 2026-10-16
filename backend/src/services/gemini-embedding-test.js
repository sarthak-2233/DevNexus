
import "dotenv/config";
import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.error("Missing GEMINI_API_KEY in backend/.env");
  process.exitCode = 1;
} else {
  try {
    const ai = new GoogleGenAI({ apiKey });

    const result = await ai.models.embedContent({
      model: "gemini-embedding-2",
      contents: "WebForge AI generates responsive React websites.",
      config: {
        outputDimensionality: 768,
      },
    });

    const embedding = result.embeddings?.[0]?.values;

    if (!embedding?.length) {
      throw new Error("No embedding vector was returned.");
    }

    console.log("Gemini embedding successful!");
    console.log("Vector dimensions:", embedding.length);
    console.log("First five values:", embedding.slice(0, 5));
  } catch (error) {
    console.error("Gemini embedding test failed.");
    console.error("Error:", error.message);
    process.exitCode = 1;
  }
}
