import { Button } from "@/components/ui/button";
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
import { MapPin, Plus } from "lucide-react";
import { RegisteredAddressCard } from "./~components/-registered-address-card";
import { RegisterAddressModal } from "./~components/-register-address-modal";

export const Route = createFileRoute("/_public/profile/registered-addresses/")({
  component: ProfileRegisteredAddressesPage,
});

function ProfileRegisteredAddressesPage() {
  const { title, description } = SECTION_META.addresses;

  const { addresses, isAddressesLoading } = useUser({
    enableAddressesQuery: true,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-bold text-xl text-amber-950 font-sagona">
          {title}
        </CardTitle>

        <CardDescription>{description}</CardDescription>
      </CardHeader>

      <Separator />

      <CardContent>
        {addresses.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-4 py-16">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <MapPin className="h-8 w-8 text-muted-foreground" />
            </div>

            <div className="text-center">
              <h3 className="font-semibold text-lg">
                Nenhum endereço cadastrado
              </h3>

              <p className="text-muted-foreground text-sm mt-1">
                Você ainda não cadastrou nenhum endereço em nossa plataforma.
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((address) => (
            <RegisteredAddressCard
              key={address.id}
              title={address.addressTitle}
              addressInfo={address}
            />
          ))}
        </div>

        <div className="flex justify-end">
          <RegisterAddressModal />
        </div>
      </CardContent>
    </Card>
  );
}
