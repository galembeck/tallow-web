import type { CartItem } from "@/types/services/cart";
import { CartItemCard } from "./-cart-item-card";

interface CartItemsProps {
  cartItems: CartItem[];

  updateQuantity: (productId: string, newQuantity: number) => void;
  isUpdatingQuantity?: boolean;
  removeItem: (productId: string) => void;
  isRemovingItem?: boolean;
}

export function CartItems({
  cartItems,
  updateQuantity,
  isUpdatingQuantity,
  removeItem,
  isRemovingItem,
}: CartItemsProps) {
  return (
    <div className="space-y-4 lg:col-span-2">
      {cartItems.map((item) => (
        <CartItemCard
          isRemovingItem={isRemovingItem}
          isUpdatingQuantity={isUpdatingQuantity}
          key={item.id}
          productDescription={item.productDescription}
          productId={item.productId}
          productImageUrl={item.productImageUrl}
          productName={item.productName}
          quantity={item.quantity}
          removeItem={removeItem}
          stockAvailable={item.stockAvailable}
          subTotal={item.subTotal}
          unitPrice={item.unitPrice}
          updateQuantity={updateQuantity}
        />
      ))}
    </div>
  );
}
