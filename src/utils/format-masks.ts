export const formatWhatsApp = (value: string) => {
  const nums = value.replace(/\D/g, "");
  if (nums.length === 0) return "";

  let formatted = "";
  if (nums.length <= 2) {
    formatted = `(${nums}`;
  } else if (nums.length <= 6) {
    formatted = `(${nums.slice(0, 2)}) ${nums.slice(2)}`;
  } else if (nums.length <= 10) {
    formatted = `(${nums.slice(0, 2)}) ${nums.slice(2, 6)}-${nums.slice(6)}`;
  } else {
    formatted = `(${nums.slice(0, 2)}) ${nums.slice(2, 7)}-${nums.slice(7, 11)}`;
  }
  return formatted;
};

export const formatCPF = (value: string) => {
  const nums = value.replace(/\D/g, "").slice(0, 11);
  if (nums.length === 0) return "";

  return nums
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
};

export const formatCEP = (value: string) => {
  const nums = value.replace(/\D/g, "").slice(0, 8);
  if (nums.length === 0) return "";

  return nums.replace(/(\d{5})(\d)/, "$1-$2");
};

export const removeFormat = (value: string) => value.replace(/\D/g, "");
