import { z } from "zod";

// Brazilian phone number validation (with or without formatting)
export const phoneSchema = z.string().refine(
  (phone) => {
    const cleaned = phone.replace(/\D/g, "");
    return cleaned.length === 10 || cleaned.length === 11;
  },
  {
    message: "Telefone deve ter 10 ou 11 dígitos",
  }
);

// Optional phone number
export const optionalPhoneSchema = z.union([
  phoneSchema,
  z.literal(""),
  z.undefined(),
]);

// Brazilian CPF validation (basic format check)
export const cpfSchema = z.string().refine(
  (cpf) => {
    const cleaned = cpf.replace(/\D/g, "");
    return cleaned.length === 11;
  },
  {
    message: "CPF deve ter 11 dígitos",
  }
);

// Optional email
export const optionalEmailSchema = z.union([
  z.string().email("Email inválido"),
  z.literal(""),
  z.undefined(),
]);

// Brazilian state code (UF)
export const stateSchema = z.string().length(2, "Estado deve ter 2 caracteres");

// Required name
export const nameSchema = z
  .string()
  .min(3, "Nome deve ter no mínimo 3 caracteres")
  .max(100, "Nome deve ter no máximo 100 caracteres");
