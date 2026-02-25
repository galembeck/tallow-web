export const formatWhatsApp = (value: string) => {
  const numbers = value.replace(/\D/g, "");
  const limited = numbers.slice(0, 11);

  if (limited.length >= 11) {
    return `(${limited.slice(0, 2)}) ${limited.slice(2, 7)}-${limited.slice(7, 11)}`;
  }
  if (limited.length >= 7) {
    return `(${limited.slice(0, 2)}) ${limited.slice(2, 7)}-${limited.slice(7)}`;
  }
  if (limited.length >= 2) {
    return `(${limited.slice(0, 2)}) ${limited.slice(2)}`;
  }
  if (limited.length > 0) {
    return `(${limited}`;
  }

  return limited;
};

export const formatCPF = (value: string) => {
  const numbers = value.replace(/\D/g, "");
  const limited = numbers.slice(0, 11);

  if (limited.length >= 11) {
    return `${limited.slice(0, 3)}.${limited.slice(3, 6)}.${limited.slice(6, 9)}-${limited.slice(9, 11)}`;
  }
  if (limited.length >= 9) {
    return `${limited.slice(0, 3)}.${limited.slice(3, 6)}.${limited.slice(6, 9)}-${limited.slice(9)}`;
  }
  if (limited.length >= 6) {
    return `${limited.slice(0, 3)}.${limited.slice(3, 6)}.${limited.slice(6)}`;
  }
  if (limited.length >= 3) {
    return `${limited.slice(0, 3)}.${limited.slice(3)}`;
  }

  return limited;
};

export const formatCEP = (value: string) => {
  const numbers = value.replace(/\D/g, "");
  const limited = numbers.slice(0, 8);

  if (limited.length >= 6) {
    return `${limited.slice(0, 5)}-${limited.slice(5, 8)}`;
  }
  if (limited.length > 0) {
    return `${limited}`;
  }

  return limited;
};

export const removeFormat = (value: string) => value.replace(/\D/g, "");
