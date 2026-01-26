import { z } from "zod";

export const TransactionSchema = z.object({
  description: z
    .string()
    .min(3, "Descrição deve ter pelo menos 3 caracteres")
    .max(100, "Descrição deve ter no máximo 100 caracteres"),
  value: z
    .union([z.string(), z.number()])
    .transform((val) => (typeof val === "string" ? parseFloat(val) : val))
    .refine((val) => !isNaN(val) && val > 0, {
      message: "Valor deve ser maior que zero",
    }),
  type: z.enum(["ENTRADA", "SAIDA"]),
  category: z.string().min(1, "Categoria é obrigatória"),
  date: z
    .union([z.string(), z.date()])
    .transform((val) => (typeof val === "string" ? new Date(val) : val))
    .refine((date) => date instanceof Date && !isNaN(date.getTime()), {
      message: "Data inválida",
    }),
});

export const UpdateTransactionSchema = TransactionSchema.extend({
  id: z.string().min(1, "ID é obrigatório"),
});

export const TransactionQuerySchema = z.object({
  month: z
    .union([z.string(), z.number()])
    .transform((val) => (typeof val === "string" ? parseInt(val, 10) : val))
    .refine((val) => !isNaN(val) && val >= 1 && val <= 12, {
      message: "Mês deve estar entre 1 e 12",
    }),
  year: z
    .union([z.string(), z.number()])
    .transform((val) => (typeof val === "string" ? parseInt(val, 10) : val))
    .refine((val) => !isNaN(val) && val >= 2000 && val <= 2100, {
      message: "Ano inválido",
    })
    .optional()
    .default(new Date().getFullYear()),
});

export type TransactionInput = z.infer<typeof TransactionSchema>;
export type UpdateTransactionInput = z.infer<typeof UpdateTransactionSchema>;
export type TransactionQuery = z.infer<typeof TransactionQuerySchema>;
