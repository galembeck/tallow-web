import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useUser } from "@/hooks/services/use-user";
import { fetchAddressByZipcode } from "@/utils/fetch-address";
import { formatCEP, formatWhatsApp, removeFormat } from "@/utils/format-masks";
import { zodResolver } from "@hookform/resolvers/zod";
import { Info, Plus, Search } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

const registerAddressFormSchema = z.object({
  addressTitle: z
    .string()
    .min(2, {
      message: "O nome do endereço deve ter no mínimo 2 caracteres.",
    })
    .max(100, {
      message: "O nome do endereço deve ter no máximo 100 caracteres.",
    })
    .nonempty({
      message: "O nome do endereço é obrigatório",
    }),
  receiverName: z.string().nonempty({
    message: "O nome do destinatário é obrigatório",
  }),
  receiverLastname: z.string().nonempty({
    message: "O sobrenome do destinatário é obrigatório",
  }),
  contactCellphone: z.string().nonempty({
    message: "O telefone de contato é obrigatório",
  }),
  zipcode: z.string().nonempty({
    message: "O CEP é obrigatório",
  }),
  address: z.string().nonempty({
    message: "O endereço é obrigatório",
  }),
  number: z.string().nonempty({
    message: "O número do endereço é obrigatório",
  }),
  complement: z.string().optional(),
  neighborhood: z.string().nonempty({
    message: "O bairro é obrigatório",
  }),
  city: z.string().nonempty({
    message: "A cidade é obrigatória",
  }),
  state: z.string().nonempty({
    message: "O estado é obrigatório",
  }),
});

type RegisterAddressFormData = z.infer<typeof registerAddressFormSchema>;

export function RegisterAddressModal() {
  const { registerAddress, isRegisteringAddress } = useUser();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddressFilled, setIsAddressFilled] = useState(false);
  const [isFetchingCep, setIsFetchingCep] = useState(false);

  const form = useForm<RegisterAddressFormData>({
    resolver: zodResolver(registerAddressFormSchema),
    mode: "onChange",
    defaultValues: {
      addressTitle: "",
      receiverName: "",
      receiverLastname: "",
      contactCellphone: "",
      zipcode: "",
      address: "",
      number: "",
      complement: "",
      neighborhood: "",
      city: "",
      state: "",
    },
  });

  const zipcode = form.watch("zipcode");

  const handleFillAddress = async (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();

    const cleanZip = removeFormat(zipcode ?? "");

    if (cleanZip.length !== 8) {
      toast.error("Digite um CEP válido com 8 dígitos.");
      return;
    }

    try {
      setIsFetchingCep(true);
      const cepData = await fetchAddressByZipcode(cleanZip);

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

      setIsAddressFilled(true);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("Não foi possível encontrar o CEP.");
      setIsAddressFilled(false);
    } finally {
      setIsFetchingCep(false);
    }
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setIsAddressFilled(false);
    form.reset();
  };

  async function onSubmit(values: RegisterAddressFormData) {
    try {
      const cleanContactCellphone = removeFormat(values.contactCellphone);
      const cleanZipcode = removeFormat(values.zipcode);

      await registerAddress({
        ...values,
        contactCellphone: cleanContactCellphone,
        zipcode: cleanZipcode,
      });

      toast.success("Endereço cadastrado com sucesso!", {
        description:
          "O endereço será listado em seu perfil e poderá ser usado em compras futuras.",
      });
      handleClose();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("Houve um erro ao cadastrar o endereço.", {
        description: "Tente novamente mais tarde ou contate o suporte.",
      });
    }
  }

  return (
    <Dialog
      open={isModalOpen}
      onOpenChange={(isModalOpen) => {
        if (!isModalOpen) {
          handleClose();
        } else {
          setIsModalOpen(true);
        }
      }}
    >
      <DialogTrigger asChild>
        <Button
          className="bg-amber-900 hover:bg-amber-900/90 text-white hover:text-white"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus />
          Cadastrar novo endereço
        </Button>
      </DialogTrigger>

      <DialogContent
        aria-describedby="Register a new address"
        className="md:max-w-3xl"
      >
        <DialogHeader>
          <DialogTitle className="text-amber-950 font-bold">
            Adicionar endereço
          </DialogTitle>
        </DialogHeader>

        <Separator orientation="horizontal" />

        <Form {...form}>
          <form
            className="flex flex-col gap-0"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <ScrollArea className="max-h-[65vh] pr-4">
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
                                O nome do endereço é apenas um rótulo para
                                facilitar a identificação do endereço
                                cadastrado.
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

                  {isAddressFilled && (
                    <div className="space-y-6">
                      <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-semibold">
                              Endereço
                            </FormLabel>

                            <FormControl>
                              <Input
                                {...field}
                                disabled
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
                              <FormLabel className="font-semibold">
                                Número
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
                            <FormLabel className="font-semibold">
                              Bairro
                            </FormLabel>

                            <FormControl>
                              <Input
                                {...field}
                                disabled
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
                              <FormLabel className="font-semibold">
                                Cidade
                              </FormLabel>

                              <FormControl>
                                <Input
                                  {...field}
                                  disabled
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
                              <FormLabel className="font-semibold">
                                Estado
                              </FormLabel>

                              <FormControl>
                                <Input
                                  {...field}
                                  disabled
                                  className="order border-amber-900/30 active:border-amber-900 active:ring-amber-900 focus-visible:ring-amber-900/30"
                                />
                              </FormControl>

                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </ScrollArea>

            <Separator className="my-4" />

            <DialogFooter className="flex gap-4">
              <Button
                className="bg-inherit hover:bg-inherit text-amber-900 hover:text-amber-900/80 border border-amber-900"
                onClick={handleClose}
                type="reset"
                variant="outline"
              >
                Cancelar
              </Button>

              <Button
                className="bg-amber-900 hover:bg-amber-900/90 text-white hover:text-white"
                type="submit"
                disabled={isRegisteringAddress}
              >
                {isRegisteringAddress ? (
                  <p className="flex items-center gap-2">
                    <Spinner />
                    Salvando...
                  </p>
                ) : (
                  <p className="flex items-center gap-2">
                    <Plus className="w-5 h-5" />
                    Salvar endereço
                  </p>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
