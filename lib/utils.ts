import { Id } from "./utilTypes";

export function chooseRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function randomId(): Id {
  return Math.random().toString(36).substring(2, 10);
}
