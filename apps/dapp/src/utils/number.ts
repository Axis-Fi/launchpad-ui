export function getPercentage(percentage: number, base: number = 1e5): number {
  // 10.12% => 101200
  return (percentage * base) / 100;
}
