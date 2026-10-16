
import "dotenv/config";
import { GoogleGenAI } from "@google/genai";
import { QdrantClient } from "@qdrant/js-client-rest";

const COLLECTION_NAME = "webforge_knowledge";
const EMBEDDING_MODEL = "gemini-embedding-2";
const VECTOR_SIZE = 768;

const knowledgeItems = [
  {
    id: 101,
    category: "responsive-design",
    text: "Responsive websites should use mobile-first CSS, flexible layouts, CSS Grid or Flexbox, fluid widths, and breakpoints where the content needs them. Avoid fixed-width layouts that overflow on small screens.",
  },
  {
    id: 102,
    category: "react-components",
    text: "React websites are easier to maintain when the interface is split into reusable components. Keep components focused, pass changing data through props, and use stable keys when rendering lists.",
  },
  {
    id: 103,
    category: "accessibility",
    text: "Accessible websites should use semantic HTML, meaningful button labels, descriptive image alt text, visible keyboard focus, sufficient color contrast, and correctly associated form labels.",
  },
  {
    id: 104,
    category: "performance",
    text: "For better website performance, optimize image sizes, avoid unnecessary dependencies, minimize repeated rendering work, and keep JavaScript and CSS focused on what the page needs.",
  },
  {
    id: 105,
    category: "visual-design",
    text: "A consistent website design should define a small color palette, a clear typography scale, predictable spacing, reusable UI patterns, and a visual hierarchy that guides visitors toward the main action.",
  },
  {
    id: 106,
    category: "forms-and-validation",
    text: "Website forms should provide clear labels, useful validation messages, appropriate input types, and accessible error feedback. Validate user input before processing it and never rely only on visual styling to communicate errors.",
  },
];

async function main() {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not configured.");
  }

  if (!process.env.QDRANT_URL || !process.env.QDRANT_API_KEY) {
    throw new Error("Qdrant environment variables are missing.");
  }

  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  });

  const qdrant = new QdrantClient({
    url: process.env.QDRANT_URL,
    apiKey: process.env.QDRANT_API_KEY,
  });

  const collection = await qdrant.getCollection(COLLECTION_NAME);
  const vectorConfig = collection.config.params.vectors;

  if (
    !vectorConfig ||
    vectorConfig.size !== VECTOR_SIZE
  ) {
    throw new Error(
      `Expected a ${VECTOR_SIZE}-dimension vector collection.`
    );
  }

  console.log(`Seeding ${knowledgeItems.length} knowledge records...`);

  for (const item of knowledgeItems) {
    const result = await ai.models.embedContent({
      model: EMBEDDING_MODEL,
      contents: item.text,
      config: {
        outputDimensionality: VECTOR_SIZE,
      },
    });

    const vector = result.embeddings?.[0]?.values;

    if (!vector || vector.length !== VECTOR_SIZE) {
      throw new Error(
        `Invalid embedding returned for record ${item.id}.`
      );
    }

    await qdrant.upsert(COLLECTION_NAME, {
      wait: true,
      points: [
        {
          id: item.id,
          vector,
          payload: {
            text: item.text,
            category: item.category,
          },
        },
      ],
    });

    console.log(`Stored record ${item.id}: ${item.category}`);
  }

  const updatedCollection = await qdrant.getCollection(COLLECTION_NAME);

  console.log("Knowledge seeding completed.");
  console.log("Total stored points:", updatedCollection.points_count);
}

main().catch((error) => {
  console.error("Knowledge seeding failed:", error.message);
  process.exitCode = 1;
});
