import z from "zod";
import { removeFormat } from "@/utils/format-masks";
import { isValidCPF } from "@/utils/is-valid-masks";

export const checkoutFormSchema = z.object({
  name: z
    .string({
      message: "O nome é obrigatório.",
    })
    .min(2, {
      message: "O nome deve conter pelo menos 2 caracteres.",
    }),
  email: z
    .string({
      message: "O e-mail é obrigatório.",
    })
    .email({
      message: "O e-mail deve ter um formato válido.",
    }),
  document: z
    .string({
      message: "O CPF é obrigatório.",
    })
    .min(11, {
      message: "O CPF deve ter 11 dígitos.",
    })
    .refine(
      (value) => {
        const cleanCPF = removeFormat(value);
        return cleanCPF.length === 11 && isValidCPF(value);
      },
      {
        message: "O CPF deve ser válido.",
      },
    ),
  cellphone: z
    .string({
      message: "O número de telefone é obrigatório.",
    })
    .min(11, {
      message: "O número de telefone deve ter 11 dígitos.",
    }),
  zipcode: z
    .string({
      message: "O CEP é obrigatório.",
    })
    .min(8, {
      message: "O CEP deve conter 8 dígitos.",
    }),
  address: z
    .string({
      message: "O endereço é obrigatório.",
    })
    .min(2, {
      message: "A rua deve ter pelo menos 2 caracteres.",
    }),
  number: z
    .string({
      message: "O número é obrigatório.",
    })
    .min(1, {
      message: "O número é obrigatório.",
    }),
  complement: z.string().optional(),
  neighborhood: z
    .string({
      message: "O bairro é obrigatório.",
    })
    .min(2, {
      message: "O bairro deve ter no mínimo 2 caracteres.",
    }),
  city: z
    .string({
      message: "A cidade é obrigatória.",
    })
    .min(2, {
      message: "A cidade deve ter no mínimo 2 caracteres.",
    }),
  state: z
    .string({
      message: "O estado é obrigatório.",
    })
    .min(2, {
      message: "O estado deve ter no mínimo 2 caracteres.",
    }),
});

export type CheckoutFormData = z.infer<typeof checkoutFormSchema>;

export const personalFields: (keyof CheckoutFormData)[] = [
  "name",
  "email",
  "document",
  "cellphone",
];

export const addressFields: (keyof CheckoutFormData)[] = [
  "zipcode",
  "address",
  "number",
  "complement",
  "neighborhood",
  "city",
  "state",
];
