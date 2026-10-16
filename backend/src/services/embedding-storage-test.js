
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

const knowledge = {
  id: 1,
  text: "WebForge AI creates responsive React websites using reusable components and modern CSS.",
  category: "web-development",
};

try {
  const result = await ai.models.embedContent({
    model: "gemini-embedding-2",
    contents: knowledge.text,
    config: {
      outputDimensionality: 768,
    },
  });

  const vector = result.embeddings?.[0]?.values;

  if (!vector || vector.length !== 768) {
    throw new Error("Expected a 768-dimensional embedding.");
  }

  await qdrant.upsert(collectionName, {
    wait: true,
    points: [
      {
        id: knowledge.id,
        vector,
        payload: {
          text: knowledge.text,
          category: knowledge.category,
        },
      },
    ],
  });

  console.log("Embedding stored successfully!");

  const info = await qdrant.getCollection(collectionName);
  console.log("Stored points:", info.points_count);
} catch (error) {
  console.error("Embedding storage test failed.");
  console.error("Error:", error.message);
  process.exitCode = 1;
}
