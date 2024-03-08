const currencyFormatter = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

/* Trims decimal based on the number of decimal places */
export function trimCurrency(input: string | number): string {
  const value = Number(input);

  if (value === 0) return "0";

  if (!isFinite(value)) {
    throw new Error(`trimCurrency received infinite value:(${value}) `);
  }

  return value < 1
    ? String(Number(trimCurrency(value * 10)) / 10)
    : currencyFormatter.format(value);
}
