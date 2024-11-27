export const currencyFormatter = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

/* Trims decimal based on the number of decimal places */
export function trimCurrency(input: string | number): string {
  if (Number.isNaN(Number(input))) return "?";

  const value = Number(input);

  if (value === 0) return "0";

  if (!isFinite(value)) {
    throw new Error(`trimCurrency received infinite value:(${value})`);
  }

  if (value < 1 && value !== 0) {
    const stringValue = value.toString();

    // Regex to remove trailing zeros after the decimal point but preserve non-zero decimals
    const trimmedValue = stringValue.replace(/(\.\d*?[1-9])0+$/g, "$1");

    return trimmedValue;
  } else {
    return currencyFormatter.format(value);
  }
}
