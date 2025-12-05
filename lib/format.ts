export function formatInt(value: number): string {
  return Math.round(value).toLocaleString();
}

export function formatBonus(value: number, format: "int" = "int"): string {
  const sign = value > 0 ? "+" : "";
  const formattedValue = format === "int" ? formatInt(value) : value.toFixed(2);
  return `${sign}${formattedValue}`;
}

export function titleCase(str: string | undefined): string {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
