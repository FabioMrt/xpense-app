import { z } from "zod";

export const CategorySchema = z.object({
  name: z
    .string()
    .min(2, "Nome da categoria deve ter pelo menos 2 caracteres")
    .max(50, "Nome da categoria deve ter no máximo 50 caracteres"),
});

export type CategoryInput = z.infer<typeof CategorySchema>;
