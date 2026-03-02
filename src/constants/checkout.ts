import z from "zod";

export const checkoutFormSchema = z.object({
  // First-step (Shipping information)
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
  number: z.string({
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

  // Second-step (Payment information)
  cardNumber: z
    .string({
      message: "O número do cartão é obrigatório.",
    })
    .min(16, {
      message: "O número do cartão deve conter 16 dígitos.",
    }),
  cardHolderName: z
    .string({
      message: "O nome do titular é obrigatório.",
    })
    .min(2, {
      message: "O nome do titular deve conter pelo menos 2 caracteres.",
    }),
  cardExpirationDate: z
    .string({
      message: "A data de validade é obrigatória.",
    })
    .min(5, {
      message: "A data de validade deve ter o formato MM/AA.",
    }),
  cardCvv: z
    .string({
      message: "O CVV é obrigatório.",
    })
    .min(3, {
      message: "O CVV deve conter pelo menos 3 dígitos.",
    }),
});

export type CheckoutFormData = z.infer<typeof checkoutFormSchema>;

export const shippingFields: (keyof CheckoutFormData)[] = [
  "name",
  "email",
  "cellphone",
  "zipcode",
  "address",
  "number",
  "complement",
  "neighborhood",
  "city",
  "state",
];
