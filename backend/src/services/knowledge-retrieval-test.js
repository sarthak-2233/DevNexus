
import { retrieveRelevantKnowledge } from "./knowledgeRetrievalService.js";

const testQueries = [
  "How do I make a website work well on mobile phones?",
  "How can I make a React app easier to maintain?",
  "What should I do to make a website accessible?",
  "How can I improve website loading speed?",
  "How should I design a contact form with validation?",
];

for (const query of testQueries) {
  console.log("\n========================================");
  console.log("Query:", query);

  try {
    const results = await retrieveRelevantKnowledge(query);

    if (results.length === 0) {
      console.log("No relevant knowledge found.");
      continue;
    }

    for (const [index, result] of results.entries()) {
      console.log(`\nResult ${index + 1}`);
      console.log("Category:", result.category);
      console.log("Score:", result.score);
      console.log("Text:", result.text);
    }
  } catch (error) {
    console.error("Search failed:", error.message);
  }
}
