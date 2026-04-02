import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { SECTION_META } from "@/constants/public/profile/section-meta";
import { useUser } from "@/hooks/services/use-user";
import { createFileRoute } from "@tanstack/react-router";
import { RegisteredAddressDataForm } from "./-registered-address-data-form";
import type { UpdateAddressData } from "@/types/services/user";
import { toast } from "sonner";

export const Route = createFileRoute(
  "/_public/profile/registered-addresses/$addressId/",
)({
  component: ProfileRegisteredAddressDetailPage,
});

function ProfileRegisteredAddressDetailPage() {
  const { addressDetails } = SECTION_META.addresses.pages;

  const { addressId } = Route.useParams();

  const { address, isAddressLoading, updateAddress, isUpdatingAddress } =
    useUser({
      addressId,
      enableAddressQuery: true,
    });

  const handleUpdateAddress = async (data: UpdateAddressData) => {
    try {
      await updateAddress(data);
      toast.success("Informações de endereço atualizadas com sucesso!");
    } catch {
      toast.error("Erro ao atualizar informações de endereço.");
    }
  };

  // TODO: Criar componente de loading/skeleton...
  if (isAddressLoading) {
    return <p>Carregando...</p>;
  }

  // TODO: Criar componente de endereço não encontrado...
  if (!address) {
    return <p>Endereço não encontrado.</p>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-bold text-amber-950 font-sagona text-xl">
          {addressDetails.title}
        </CardTitle>

        <CardDescription>{addressDetails.description}</CardDescription>
      </CardHeader>

      <Separator />

      <CardContent>
        <RegisteredAddressDataForm
          address={address}
          onSubmit={handleUpdateAddress}
          isSubmitting={isUpdatingAddress}
        />
      </CardContent>
    </Card>
  );
}
