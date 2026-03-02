export interface Cart {
  id: string;

  userId: string;

  items: CartItem[];
  totalAmount: number;
  totalItems: number;

  updatedAt?: string;
}

export interface CartItem {
  id: string;

  productId: string;
  productName: string;
  productDescription: string;
  productImageUrl: string;

  quantity: number;
  unitPrice: number;
  subTotal: number;

  stockAvailable: number;
}

export interface AddToCartRequest {
  productId: string;
  quantity: number;
}

export interface UpdateCartItemRequest {
  productId: string;
  quantity: number;
}
