import { useQuery } from "@tanstack/react-query";
import { productModule } from "@/api/http/routes/product";

export function useProduct() {
  const { data: products, isLoading } = useQuery({
    queryKey: ["products", "list"],
    queryFn: async () => {
      return await productModule.list();
    },
  });

  return {
    products,
    isLoading,
  };
}
