import { GameContext } from "./gameContext";

export type OptionalFunc<TReturn, TArgs extends unknown[] = unknown[]> =
  | ((...args: TArgs) => TReturn)
  | TReturn;

export function getFromOptionalFunc<TReturn, TArgs extends unknown[]>(
  optionalFunc: OptionalFunc<TReturn, TArgs>,
  ...args: TArgs
): TReturn {
  if (typeof optionalFunc === "function") {
    return (optionalFunc as (...args: TArgs) => TReturn)(...args);
  } else {
    return optionalFunc;
  }
}

export type Id = string | number | symbol;

export type Context = {
  game: GameContext;
  updateGameState: () => void;
};

export type MakeRequired<T, K extends keyof T> = T & {
  [P in K]-?: T[P];
};