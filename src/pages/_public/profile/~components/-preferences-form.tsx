import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import type { UpdateProfileData, UserPreferences } from "@/types/services/user";
import { useState } from "react";

type PreferencesSubmitData = Pick<
  UpdateProfileData,
  "receiveEmailOffers" | "receiveWhatsappOffers"
>;

interface PreferencesFormProps {
  preferences: UserPreferences;
  onSubmit: (data: PreferencesSubmitData) => Promise<void>;
  isSubmitting: boolean;
}

export function PreferencesForm({
  preferences,
  onSubmit,
  isSubmitting,
}: PreferencesFormProps) {
  const [receiveEmailOffers, setReceiveEmailOffers] = useState(
    preferences.receiveEmailOffers,
  );
  const [receiveWhatsappOffers, setReceiveWhatsappOffers] = useState(
    preferences.receiveWhatsappOffers,
  );

  const handleSubmit = () => {
    onSubmit({ receiveEmailOffers, receiveWhatsappOffers });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Preferências de e-mail</CardTitle>
        <CardDescription>
          Controle quais comunicações você deseja receber da Terra & Tallow.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-start gap-4">
          <Checkbox
            id="receive-email-offers"
            checked={receiveEmailOffers}
            onCheckedChange={(checked) =>
              setReceiveEmailOffers(checked === true)
            }
            className="mt-0.5"
          />
          <div className="flex flex-col gap-1">
            <Label
              htmlFor="receive-email-offers"
              className="cursor-pointer font-medium"
            >
              Ofertas por e-mail
            </Label>
            <p className="text-muted-foreground text-sm">
              Receba novidades sobre produtos, promoções exclusivas e
              lançamentos da Terra & Tallow por e-mail.
            </p>
          </div>
        </div>

        <Separator />

        <div className="flex items-start gap-4">
          <Checkbox
            id="receive-whatsapp-offers"
            checked={receiveWhatsappOffers}
            onCheckedChange={(checked) =>
              setReceiveWhatsappOffers(checked === true)
            }
            className="mt-0.5"
          />
          <div className="flex flex-col gap-1">
            <Label
              htmlFor="receive-whatsapp-offers"
              className="cursor-pointer font-medium"
            >
              Ofertas por WhatsApp
            </Label>
            <p className="text-muted-foreground text-sm">
              Receba promoções e novidades diretamente no seu WhatsApp.
            </p>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="cursor-pointer bg-amber-900 hover:bg-amber-900/90 text-white"
          >
            {isSubmitting ? "Salvando..." : "Salvar preferências"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
