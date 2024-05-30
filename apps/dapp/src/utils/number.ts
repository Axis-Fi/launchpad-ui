export function getPercentage(percentage: number, base: number = 1e5): number {
  // 10.12% => 101200
  return (percentage * base) / 100;
}

export function parsePercent(e: React.ChangeEvent<HTMLInputElement>) {
  //Separate the percent sign from the number:
  const int = e.target.value.slice(0, e.target.value.length - 1);
  /* If there is no number (just the percent sign), rewrite
       it so it persists and move the cursor just before it.*/
  if (int.includes("%")) {
    e.target.value = "%";
    e.target.setSelectionRange(0, 0);
  } else if (int.length >= 3 && int.length <= 4 && !int.includes(".")) {
    /* If the whole has been written and we are starting the
       fraction rewrite to include the decimal point and percent 
       sign. The fraction is a sigle digit. Cursor is moved to 
       just ahead of this digit.*/
    e.target.value = int.slice(0, 2) + "." + int.slice(2, 3) + "%";
    e.target.setSelectionRange(4, 4);
  } else if (int.length >= 5 && int.length <= 6) {
    const whole = int.slice(0, 2);
    const fraction = int.slice(3, 5);
    e.target.value = whole + "." + fraction + "%";
  } else {
    /* 
     if the element has just been clicked on we want the cursor before the percent sign.*/
    e.target.value = int + "%";
    e.target.setSelectionRange(
      e.target.value.length - 1,
      e.target.value.length - 1,
    );
  }
}

/** Converts a number or string into basis points format
 * 1% -> 1000
 */
export function toBasisPoints(percentage: string | number) {
  const _percentage =
    typeof percentage === "string" ? parseFloat(percentage) : percentage;

  return _percentage * 1000;
}

/** Converts a number or string in basis points format to percentage
 * 1000 -> 1
 */
export function fromBasisPoints(percentage: string | number) {
  const _basisPoints =
    typeof percentage === "string" ? parseFloat(percentage) : percentage;

  return _basisPoints / 1000;
}

export function formatPercentage(percentage: number) {
  return new Intl.NumberFormat("en-us", {
    maximumFractionDigits: 2,
  }).format(percentage);
}
