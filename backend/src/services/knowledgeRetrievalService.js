
import "dotenv/config";
import { GoogleGenAI } from "@google/genai";
import { QdrantClient } from "@qdrant/js-client-rest";

const COLLECTION_NAME = "webforge_knowledge";
const EMBEDDING_MODEL = "gemini-embedding-2";
const VECTOR_SIZE = 768;
const MAX_CACHE_ENTRIES = 100;

let aiClient;
let qdrantClient;

const embeddingCache = new Map();

function getAiClient() {
  if (!aiClient) {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not configured.");
    }

    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });
  }

  return aiClient;
}

function getQdrantClient() {
  if (!qdrantClient) {
    if (!process.env.QDRANT_URL || !process.env.QDRANT_API_KEY) {
      throw new Error("Qdrant environment variables are missing.");
    }

    qdrantClient = new QdrantClient({
      url: process.env.QDRANT_URL,
      apiKey: process.env.QDRANT_API_KEY,
    });
  }

  return qdrantClient;
}


async function getQueryEmbedding(query) {
  const cacheKey = query.trim().toLowerCase();

  if (embeddingCache.has(cacheKey)) {
    const cachedVector = embeddingCache.get(cacheKey);

    // Reuse the cached embedding or in-progress request.
    embeddingCache.delete(cacheKey);
    embeddingCache.set(cacheKey, cachedVector);

    if (cachedVector instanceof Promise) {
      console.log("Embedding request already in progress; sharing it.");
      return await cachedVector;
    }

    console.log("Embedding cache hit.");
    return cachedVector;
  }

  console.log("Embedding cache miss; requesting Gemini.");

  const embeddingPromise = (async () => {
    const ai = getAiClient();

    const embeddingResult = await ai.models.embedContent({
      model: EMBEDDING_MODEL,
      contents: query.trim(),
      config: {
        outputDimensionality: VECTOR_SIZE,
      },
    });

    const vector = embeddingResult.embeddings?.[0]?.values;

    if (!vector || vector.length !== VECTOR_SIZE) {
      throw new Error("Gemini returned an unexpected embedding size.");
    }

    return vector;
  })();

  // Cache the promise immediately, before Gemini responds.
  embeddingCache.set(cacheKey, embeddingPromise);

  // Keep the cache limited to MAX_CACHE_ENTRIES.
  while (embeddingCache.size > MAX_CACHE_ENTRIES) {
    const oldestKey = embeddingCache.keys().next().value;

    if (oldestKey === undefined) {
      break;
    }

    embeddingCache.delete(oldestKey);
  }

  try {
    const vector = await embeddingPromise;

    // Replace the promise with the completed vector only if this
    // cache entry still points to the same request.
    if (embeddingCache.get(cacheKey) === embeddingPromise) {
      embeddingCache.set(cacheKey, vector);
    }

    return vector;
  } catch (error) {
    // Remove failed requests so a future call can retry.
    if (embeddingCache.get(cacheKey) === embeddingPromise) {
      embeddingCache.delete(cacheKey);
    }

    throw error;
  }
}




export async function retrieveRelevantKnowledge(query) {
  if (typeof query !== "string" || !query.trim()) {
    throw new Error("A non-empty search query is required.");
  }

  const qdrant = getQdrantClient();

  // Avoid consuming Gemini quota when the collection is empty.
  const collection = await qdrant.getCollection(COLLECTION_NAME);

  if (collection.points_count === 0) {
    return [];
  }

  const vector = await getQueryEmbedding(query);

  const searchResult = await qdrant.query(COLLECTION_NAME, {
    query: vector,
    limit: 3,
    with_payload: true,
  });

  return searchResult.points
    .filter((point) => point.score >= 0.65)
    .map((point) => ({
      text: point.payload?.text,
      category: point.payload?.category,
      score: point.score,
    }))
    .filter((item) => typeof item.text === "string" && item.text.trim());
}
