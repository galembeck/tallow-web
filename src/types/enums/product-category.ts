export const ProductCategory = {
  FACE: 1,
  BODY: 2,
} as const;

export type ProductCategory =
  (typeof ProductCategory)[keyof typeof ProductCategory];

export const ProductCategoryLabel: Record<ProductCategory, string> = {
  [ProductCategory.FACE]: "Rosto",
  [ProductCategory.BODY]: "Corpo",
};

export function getProductCategoryLabel(category: ProductCategory): string {
  return ProductCategoryLabel[category];
}
