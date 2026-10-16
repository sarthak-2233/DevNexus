
import { retrieveRelevantKnowledge } from "./knowledgeRetrievalService.js";

const query = "How can I make a React website mobile-friendly?";

for (let run = 1; run <= 2; run++) {
  console.log(`\n--- Search ${run} ---`);

  const results = await retrieveRelevantKnowledge(query);

  console.log("Results returned:", results.length);

  if (results.length > 0) {
    console.log("Top category:", results[0].category);
    console.log("Top score:", results[0].score);
  }
}
