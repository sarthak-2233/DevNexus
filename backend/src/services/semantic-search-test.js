
import "dotenv/config";
import { GoogleGenAI } from "@google/genai";
import { QdrantClient } from "@qdrant/js-client-rest";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const qdrant = new QdrantClient({
  url: process.env.QDRANT_URL,
  apiKey: process.env.QDRANT_API_KEY,
});

const collectionName = "webforge_knowledge";
const query = "How can I build a mobile-friendly website with React?";

try {
  const result = await ai.models.embedContent({
    model: "gemini-embedding-2",
    contents: query,
    config: {
      outputDimensionality: 768,
    },
  });

  const vector = result.embeddings?.[0]?.values;

  if (!vector || vector.length !== 768) {
    throw new Error("Expected a 768-dimensional query embedding.");
  }

  const searchResult = await qdrant.query(collectionName, {
    query: vector,
    limit: 3,
    with_payload: true,
  });

  console.log("Search query:", query);
  console.log("Matching knowledge:");

  for (const item of searchResult.points) {
    console.log("\nScore:", item.score);
    console.log("Text:", item.payload?.text);
    console.log("Category:", item.payload?.category);
  }
} catch (error) {
  console.error("Semantic search failed.");
  console.error("Error:", error.message);
  process.exitCode = 1;
}
