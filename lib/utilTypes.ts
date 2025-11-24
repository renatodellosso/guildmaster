export type OptionalFunc<TReturn, TArgs extends unknown[] = unknown[]> =
  | ((...args: TArgs) => TReturn)
  | TReturn;
