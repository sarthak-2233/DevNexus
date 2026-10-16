
import { retrieveRelevantKnowledge } from "./knowledgeRetrievalService.js";

const query = "How can I make a React website mobile-friendly?";

console.log("Starting three simultaneous searches...");

const results = await Promise.all([
  retrieveRelevantKnowledge(query),
  retrieveRelevantKnowledge(query),
  retrieveRelevantKnowledge(query),
]);

console.log("All searches completed.");

for (let index = 0; index < results.length; index++) {
  console.log(
    `Search ${index + 1}: ${results[index].length} result(s)`
  );
}
