
import "dotenv/config";
import { QdrantClient } from "@qdrant/js-client-rest";

const url = process.env.QDRANT_URL;
const apiKey = process.env.QDRANT_API_KEY;

if (!url || !apiKey) {
  console.error(
    "Missing QDRANT_URL or QDRANT_API_KEY in backend/.env"
  );
  process.exitCode = 1;
} else {
  try {
    const client = new QdrantClient({
      url,
      apiKey,
    });

    const result = await client.getCollections();

    console.log("Connected to Qdrant Cloud successfully!");
    console.log(
      "Available collections:",
      result.collections.map((collection) => collection.name)
    );
  } catch (error) {
    console.error("Qdrant connection failed.");
    console.error("Error:", error.message);
    process.exitCode = 1;
  }
}
