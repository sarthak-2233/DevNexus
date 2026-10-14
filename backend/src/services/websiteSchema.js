import { z } from "zod";

export const websiteSchema = z.object({
  name: z.string().min(1),
  purpose: z.string().min(1),
  targetAudience: z.string().min(1),

  pages: z
    .array(
      z.object({
        title: z.string().min(1),
        slug: z.string().min(1),
        purpose: z.string().min(1),
        sections: z.array(z.string()).min(1),
      })
    )
    .min(1),

  features: z.array(z.string()),

  design: z.object({
    style: z.string().min(1),
    // Accept either a string or an array of strings.
    // The service normalizes this to an array before returning.
    colorPalette: z.union([z.string(), z.array(z.string())]),
    typography: z.string().min(1),
    layout: z.string().min(1),
  }),

  components: z.array(z.string()),
});