
import { z } from "zod";

export const generatedFilesSchema = z.object({
  files: z.array(
    z.object({
      path: z.string().min(1),
      content: z.string(),
    }).strict()
  ).min(3).max(3),
}).strict();
