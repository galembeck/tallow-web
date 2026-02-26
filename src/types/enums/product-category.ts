export const ProductCategory = {
  FACE: 1,
  BODY: 2,
} as const;

export type ProductCategory =
  (typeof ProductCategory)[keyof typeof ProductCategory];
