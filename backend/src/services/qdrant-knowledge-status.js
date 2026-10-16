
import "dotenv/config";
import { QdrantClient } from "@qdrant/js-client-rest";

const client = new QdrantClient({
  url: process.env.QDRANT_URL,
  apiKey: process.env.QDRANT_API_KEY,
});

try {
  const info = await client.getCollection("webforge_knowledge");

  console.log("Collection: webforge_knowledge");
  console.log("Stored points:", info.points_count);
  console.log("Vector configuration:", info.config.params.vectors);
} catch (error) {
  console.error("Could not inspect Qdrant collection.");
  console.error(error.message);
  process.exitCode = 1;
}
