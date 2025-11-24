export type OptionalFunc<TReturn, TArgs extends unknown[] = unknown[]> =
  | ((...args: TArgs) => TReturn)
  | TReturn;

export type Id = string | number | symbol;
