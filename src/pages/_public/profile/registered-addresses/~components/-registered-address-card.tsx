import { Button } from "@/components/ui/button";
import { useUser } from "@/hooks/services/use-user";
import type { UserAddress } from "@/types/services/user";
import { formatWhatsApp } from "@/utils/format-masks";
import { useNavigate } from "@tanstack/react-router";
import { Edit, X } from "lucide-react";
import { toast } from "sonner";

interface RegisteredAddressCardProps {
  title: string;
  addressInfo: UserAddress;
}

export function RegisteredAddressCard({
  title,
  addressInfo,
}: RegisteredAddressCardProps) {
  const navigate = useNavigate();

  const { deleteAddress, isDeletingAddress } = useUser();

  const handleDelete = async () => {
    try {
      await deleteAddress(addressInfo.id);
      toast.success("Endereço cadastrado excluído com sucesso.");
    } catch {
      toast.error("Ocorreu um erro ao excluir o endereço cadastrado.");
    }
  };

  return (
    <div className="bg-white border border-amber-900/30 p-4 rounded-lg">
      <div className="flex items-center justify-between">
        <h2 className="font-bold">{title}</h2>

        <Button
          variant="secondary"
          size="icon"
          className="bg-inherit hover:bg-inherit border border-amber-900"
          disabled={isDeletingAddress}
          onClick={handleDelete}
        >
          <X className="text-amber-900" />
        </Button>
      </div>

      <article className="flex flex-col gap-2 mt-4">
        <p className="text-sm text-gray-600">
          {addressInfo.receiverName} {addressInfo.receiverLastname} |{" "}
          {formatWhatsApp(addressInfo.contactCellphone)}
        </p>

        <p className="text-sm text-gray-600">
          {addressInfo.address}, {addressInfo.number}{" "}
          {addressInfo.complement !== "" ||
            (addressInfo.complement !== null && addressInfo.complement)}
        </p>

        <p className="text-sm text-gray-600">{addressInfo.neighborhood}</p>

        <p className="text-sm text-gray-600">
          {addressInfo.city}, {addressInfo.state} - {addressInfo.zipcode}
        </p>
      </article>

      <div className="flex justify-end mt-4">
        <Button
          className="bg-inherit hover:bg-inherit border border-amber-900 text-amber-900 hover:underline"
          onClick={() =>
            navigate({
              to: "/profile/registered-addresses/$addressId",
              params: { addressId: addressInfo.id },
            })
          }
        >
          <Edit />
          Editar
        </Button>
      </div>
    </div>
  );
}
