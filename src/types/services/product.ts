import type { ProductCategory } from "../enums/product-category";

export interface Product {
  id: string;

  name: string;
  description: string;
  category: ProductCategory;
  price: number;
  ingredients: string[];
  stockAmount: number;
}
