export function formatInt(value: number): string {
  return Math.round(value).toLocaleString();
}

export function titleCase(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
