import { CreatureInstance } from "./creature";
import { GameContext } from "./gameContext";
import { Id } from "./utilTypes";

export function chooseRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Inclusive
 */
export function randRange(range: [number, number]): number {
  const [min, max] = range;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function randomId(): Id {
  return Math.random().toString(36).substring(2, 10);
}

export function chance(percent: number): boolean {
  return Math.random() < percent;
}

export function getCreature<TCreature extends CreatureInstance>(
  creatureId: TCreature | Id,
  gameContext: GameContext
) {
  if (typeof creatureId === "string") {
    return gameContext.roster[creatureId];
  } else {
    return creatureId as TCreature;
  }
}

export function round(num: number, decimals: number = 0): number {
  const factor = Math.pow(10, decimals);
  return Math.round(num * factor) / factor;
}

export function deepCopy<T>(obj: T): T {
  if (Array.isArray(obj)) {
    return obj.map((item) => deepCopy(item)) as unknown as T;
  } else if (obj && typeof obj === "object") {
    const copy: any = {};
    for (const key in obj) {
      copy[key] = deepCopy((obj as any)[key]);
    }
    return copy;
  } else {
    return obj;
  }
}
