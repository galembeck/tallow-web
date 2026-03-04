/** biome-ignore-all lint/performance/useTopLevelRegex: required by CEP validation */

function isAllCharsRepeatedValues(cpfString: string) {
  const REMOVE_ALL_NON_DIGIT_REGEXP = /[^\d]+/g;
  const CHECK_FULL_CPF_SAME_CHAR_REPETITIONS_REGEXP = /(\d)\1{10}/g;
  return CHECK_FULL_CPF_SAME_CHAR_REPETITIONS_REGEXP.test(
    cpfString.replace(REMOVE_ALL_NON_DIGIT_REGEXP, ""),
  );
}

function firstVerificationDigit(cpfDigits: number[]) {
  const multipliers = [10, 9, 8, 7, 6, 5, 4, 3, 2];
  const x =
    multipliers.reduce((result, multiplier, index) => {
      const matchingDigit = cpfDigits[index];

      return result + matchingDigit * multiplier;
    }, 0) % 11;

  if (x < 2) {
    return 0;
  }
  return 11 - x;
}

function secondVerificationDigit(cpfDigits: number[]) {
  const multipliers = [11, 10, 9, 8, 7, 6, 5, 4, 3, 2];
  const x =
    multipliers.reduce((result, multiplier, index) => {
      const matchingDigit = cpfDigits[index];

      return result + matchingDigit * multiplier;
    }, 0) % 11;

  if (x < 2) {
    return 0;
  }
  return 11 - x;
}

export function isValidCPF(value: string) {
  const digitsOnlyStr = value.replace(/[\s-/.]/g, "");

  // biome-ignore lint/style/useBlockStatements: required by CPF validation
  if (digitsOnlyStr.length !== 11 || isAllCharsRepeatedValues(value))
    return false;

  const cpfDigits = digitsOnlyStr
    .split("")
    .map((digit) => Number.parseInt(digit, 10));

  return (
    cpfDigits[9] === firstVerificationDigit(cpfDigits) &&
    cpfDigits[10] === secondVerificationDigit(cpfDigits)
  );
}

export function isValidCEP(value: string) {
  const cep = value.replace(/\D/g, "");
  return /^\d{8}$/.test(cep);
}
