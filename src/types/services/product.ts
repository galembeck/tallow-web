import type { ProductCategory } from "../enums/product-category";

export interface Product {
  id: string;

  name: string;
  description: string;
  category: ProductCategory;
  price: number;
  ingredients: string[];
  stockAmount: number;

  weight: number;
  height: number;
  width: number;
  length: number;

  imageUrl: string;
  additionalImagesUrls?: string[];
}
