const currencyFormatter = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

/* Trims decimal based on the number of decimal places */
export function trimCurrency(input: string | number): string {
  const value = Number(input);
  return value < 1
    ? String(Number(trimCurrency(String(value * 10))) / 10)
    : currencyFormatter.format(value);
}
