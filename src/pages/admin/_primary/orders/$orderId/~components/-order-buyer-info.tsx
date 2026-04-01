import { InfoRow } from "@/components/info-row";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/utils/format-currency";
import type { BuyerInfoDTO, ShippingInfoDTO } from "@/types/services/order";

interface OrderBuyerInfoProps {
  buyerInfo: BuyerInfoDTO;
  shippingInfo: ShippingInfoDTO;
  shippingAmount: number;
}

export function OrderBuyerInfo({
  buyerInfo,
  shippingInfo,
  shippingAmount,
}: OrderBuyerInfoProps) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h3 className="font-semibold text-lg mb-4">Informações do comprador</h3>
        <Separator className="mb-4" />
        <div className="grid grid-cols-2 gap-4">
          <InfoRow label="Nome" value={buyerInfo.name} />
          <InfoRow label="Email" value={buyerInfo.email} />
          <InfoRow label="Telefone" value={buyerInfo.cellphone} />
          <InfoRow label="CPF" value={<span>{buyerInfo.document}</span>} />
        </div>
      </div>

      <div className="border rounded-lg p-4">
        <h3 className="font-semibold text-base mb-4">Endereço de entrega</h3>
        <div className="grid grid-cols-2 gap-4">
          <InfoRow
            label="CEP"
            value={<span>{shippingInfo.shippingZipcode}</span>}
          />
          <InfoRow
            label="Bairro"
            value={shippingInfo.shippingNeighborhood}
          />
          <div className="col-span-2">
            <InfoRow
              label="Endereço"
              value={[
                shippingInfo.shippingAddress,
                shippingInfo.shippingNumber,
                shippingInfo.shippingComplement,
              ]
                .filter(Boolean)
                .join(", ")}
            />
          </div>
          <InfoRow
            label="Cidade/Estado"
            value={`${shippingInfo.shippingCity}, ${shippingInfo.shippingState}`}
          />
          <InfoRow
            label="Serviço de entrega"
            value={shippingInfo.shippingService}
          />
          <InfoRow
            label="Prazo estimado"
            value={shippingInfo.shippingDeliveryTime}
          />
          <InfoRow
            label="Valor do frete"
            value={formatCurrency(shippingAmount)}
          />
        </div>
      </div>
    </div>
  );
}
