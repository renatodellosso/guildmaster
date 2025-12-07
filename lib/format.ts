import { Damage } from "./damage";
import { round } from "./utils";

export function formatInt(value: number): string {
  return Math.round(value).toLocaleString();
}

export function formatBonus(
  value: number,
  format: "int" | "percent" = "int"
): string {
  const sign = value > 0 ? "+" : "";
  const formattedValue =
    format === "int" ? formatInt(value) : formatPercent(value);
  return `${sign}${formattedValue}`;
}

export function formatPercent(value: number): string {
  const rounded = round(value * 100, 1);
  return `${rounded}%`;
}

export function formatDamage(damages: Damage[]): string {
  return damages
    .map((dmg) => `${formatInt(dmg.amount)} ${dmg.type}`)
    .join(", ");
}

export function formatDuration(ticks: number): string {
  if (isNaN(ticks) || ticks === Infinity) {
    return "∞";
  }

  const seconds = ticks % 60;
  const minutes = Math.floor(ticks / 60) % 60;
  const hours = Math.floor(ticks / 3600);

  const parts: string[] = [];
  if (hours > 0) {
    parts.push(`${hours}h`);
  }
  if (minutes > 0) {
    parts.push(`${minutes}m`);
  }
  if (seconds > 0 || parts.length === 0) {
    parts.push(`${seconds}s`);
  }

  return parts.join("");
}

export function titleCase(str: string | undefined): string {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
