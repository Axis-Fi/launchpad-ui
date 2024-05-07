const currencyFormatter = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/* Trims decimal based on the number of decimal places */
export function trimCurrency(input: string | number): string {
  const value = Number(input);

  if (value === 0) return "0";

  if (!isFinite(value)) {
    throw new Error(`trimCurrency received infinite value:(${value})`);
  }

  if (value < 1 && value !== 0) {
    const absLog = -Math.floor(Math.log10(Math.abs(value)));
    const decimalPlaces = Math.min(8, absLog + 2); // Allow at least 2 significant figures
    const adjustedValue = Number(value.toFixed(decimalPlaces));
    return adjustedValue.toString();
  } else {
    return currencyFormatter.format(value);
  }
}

export const abbreviateNumber = (num: number): string => {
  if (num < 10000) return currencyFormatter.format(num);
  const symbols = ["", "k", "M", "B", "T", "Q", "GMI"]; 
  const sign = Math.sign(num); 
  num = Math.abs(num); 
  const mag = Math.min(Math.floor(Math.log10(num) / 3), symbols.length - 1); 
  const shortNum = Number((num / Math.pow(10, mag * 3)).toFixed(1)) * sign; 
  if (mag < 1) return trimCurrency(num);
  return `${shortNum}${symbols[mag]}`;
};