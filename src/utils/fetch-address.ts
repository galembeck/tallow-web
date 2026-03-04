interface ViaCepResponse {
  logradouro?: string;
  bairro?: string;
  localidade?: string;
  uf?: string;
  complemento?: string;
  erro?: boolean;
}

export const fetchAddressByZipcode = async (zipcode: string) => {
  const response = await fetch(`https://viacep.com.br/ws/${zipcode}/json/`);
  if (!response.ok) {
    throw new Error("Falha ao consultar CEP");
  }

  const data: ViaCepResponse = await response.json();
  if (data.erro) {
    throw new Error("CEP não encontrado");
  }

  return data;
};
