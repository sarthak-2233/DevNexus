
import "dotenv/config";
import { QdrantClient } from "@qdrant/js-client-rest";

const url = process.env.QDRANT_URL;
const apiKey = process.env.QDRANT_API_KEY;
const collectionName = "webforge_knowledge";

if (!url || !apiKey) {
  console.error("Missing QDRANT_URL or QDRANT_API_KEY in backend/.env");
  process.exitCode = 1;
} else {
  try {
    const client = new QdrantClient({ url, apiKey });

    const result = await client.getCollections();
    const exists = result.collections.some(
      (collection) => collection.name === collectionName
    );

    if (exists) {
      console.log(`Collection "${collectionName}" already exists.`);
    } else {
      await client.createCollection(collectionName, {
        vectors: {
          size: 768,
          distance: "Cosine",
        },
      });

      console.log(`Collection "${collectionName}" created successfully.`);
    }

    const info = await client.getCollection(collectionName);
    console.log("Vector configuration:", info.config.params.vectors);
  } catch (error) {
    console.error("Qdrant collection setup failed.");
    console.error("Error:", error.message);
    process.exitCode = 1;
  }
}
