import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { UpdateAddressData, UserAddress } from "@/types/services/user";
import { fetchAddressByZipcode } from "@/utils/fetch-address";
import { formatCEP, formatWhatsApp, removeFormat } from "@/utils/format-masks";
import { Info, Search } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { isDirty } from "zod/v3";

type RegisteredAddressDataFormValues = Pick<
  UpdateAddressData,
  | "addressTitle"
  | "receiverName"
  | "receiverLastname"
  | "contactCellphone"
  | "zipcode"
  | "address"
  | "number"
  | "complement"
  | "neighborhood"
  | "city"
  | "state"
>;

interface RegisteredAddressDataFormProps {
  address: UserAddress;
  onSubmit: (data: RegisteredAddressDataFormValues) => Promise<void>;
  isSubmitting: boolean;
}

export function RegisteredAddressDataForm({
  address,
  onSubmit,
  isSubmitting,
}: RegisteredAddressDataFormProps) {
  const [isFetchingCep, setIsFetchingCep] = useState(false);

  const handleFillAddress = async (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();

    const zipcode = form.watch("zipcode");

    const cleanZipcode = removeFormat(zipcode ?? "");

    if (cleanZipcode.length !== 8) {
      toast.error("Digite um CEP válido com 8 dígitos.");
      return;
    }

    try {
      setIsFetchingCep(true);
      const cepData = await fetchAddressByZipcode(cleanZipcode);

      if (cepData.erro) {
        toast.error("O CEP informado não foi encontrado.");
      }

      form.setValue("address", cepData.logradouro ?? "", {
        shouldValidate: true,
      });
      form.setValue("neighborhood", cepData.bairro ?? "", {
        shouldValidate: true,
      });
      form.setValue("city", cepData.localidade ?? "", { shouldValidate: true });
      form.setValue("state", cepData.uf ?? "", { shouldValidate: true });

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("Não foi possível encontrar o CEP.");
    } finally {
      setIsFetchingCep(false);
    }
  };

  const form = useForm<RegisteredAddressDataFormValues>({
    values: {
      addressTitle: address.addressTitle,
      receiverName: address.receiverName,
      receiverLastname: address.receiverLastname,
      contactCellphone: removeFormat(address.contactCellphone || ""),
      zipcode: address.zipcode,
      address: address.address,
      number: address.number,
      complement: address.complement || "",
      neighborhood: address.neighborhood,
      city: address.city,
      state: address.state,
    },
  });

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-0"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6 pb-2 px-0.75">
            <FormField
              control={form.control}
              name="addressTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">
                    Nome do endereço
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="text-sky-600/80 size-3" />
                      </TooltipTrigger>

                      <TooltipContent>
                        <p>
                          O nome do endereço é apenas um rótulo para facilitar a
                          identificação do endereço cadastrado.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </FormLabel>

                  <FormControl>
                    <Input
                      {...field}
                      className="order border-amber-900/30 active:border-amber-900 active:ring-amber-900 focus-visible:ring-amber-900/30"
                      placeholder="Casa, trabalho, etc..."
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="receiverName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">
                    Nome do destinatário
                  </FormLabel>

                  <FormControl>
                    <Input
                      {...field}
                      className="order border-amber-900/30 active:border-amber-900 active:ring-amber-900 focus-visible:ring-amber-900/30"
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="receiverLastname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">
                    Sobrenome do destinatário
                  </FormLabel>

                  <FormControl>
                    <Input
                      {...field}
                      className="order border-amber-900/30 active:border-amber-900 active:ring-amber-900 focus-visible:ring-amber-900/30"
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contactCellphone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">
                    Celular de contato
                  </FormLabel>

                  <FormControl>
                    <Input
                      {...field}
                      onChange={(e) => {
                        const formatted = formatWhatsApp(e.target.value);
                        field.onChange(formatted);
                      }}
                      placeholder="(19) 99999-9999"
                      className="order border-amber-900/30 active:border-amber-900 active:ring-amber-900 focus-visible:ring-amber-900/30"
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-6 pb-2 px-0.75">
            <FormField
              control={form.control}
              name="zipcode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">CEP</FormLabel>

                  <FormControl>
                    <div className="flex items-center gap-2">
                      <Input
                        {...field}
                        onChange={(e) => {
                          const formatted = formatCEP(e.target.value);
                          field.onChange(formatted);
                        }}
                        placeholder="00000-000"
                        className="order border-amber-900/30 active:border-amber-900 active:ring-amber-900 focus-visible:ring-amber-900/30"
                      />

                      <Button
                        className="bg-amber-900 hover:bg-amber-900/90 text-white hover:text-white shrink-0"
                        onClick={() => handleFillAddress()}
                        type="button"
                        disabled={isFetchingCep}
                      >
                        {isFetchingCep ? (
                          <Spinner className="size-4" />
                        ) : (
                          <Search className="size-4" />
                        )}
                        <span>Buscar</span>
                      </Button>
                    </div>
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-6">
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold">Endereço</FormLabel>

                    <FormControl>
                      <Input
                        {...field}
                        readOnly
                        className="order border-amber-900/30 active:border-amber-900 active:ring-amber-900 focus-visible:ring-amber-900/30"
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex items-center gap-2">
                <FormField
                  control={form.control}
                  name="number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold">Número</FormLabel>

                      <FormControl>
                        <Input
                          {...field}
                          className="order border-amber-900/30 active:border-amber-900 active:ring-amber-900 focus-visible:ring-amber-900/30"
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="complement"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold">
                        Complemento
                      </FormLabel>

                      <FormControl>
                        <Input
                          {...field}
                          className="order border-amber-900/30 active:border-amber-900 active:ring-amber-900 focus-visible:ring-amber-900/30"
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="neighborhood"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold">Bairro</FormLabel>

                    <FormControl>
                      <Input
                        {...field}
                        readOnly
                        className="order border-amber-900/30 active:border-amber-900 active:ring-amber-900 focus-visible:ring-amber-900/30"
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex items-center gap-2">
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold">Cidade</FormLabel>

                      <FormControl>
                        <Input
                          {...field}
                          readOnly
                          className="order border-amber-900/30 active:border-amber-900 active:ring-amber-900 focus-visible:ring-amber-900/30"
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold">Estado</FormLabel>

                      <FormControl>
                        <Input
                          {...field}
                          readOnly
                          className="order border-amber-900/30 active:border-amber-900 active:ring-amber-900 focus-visible:ring-amber-900/30"
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-8">
          <Button
            type="submit"
            disabled={isSubmitting || !isDirty}
            className="bg-amber-900 hover:bg-amber-900/90 text-white hover:text-white"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-1">
                <Spinner />
                <p>Salvando...</p>
              </span>
            ) : (
              <p>Salvar alterações</p>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
