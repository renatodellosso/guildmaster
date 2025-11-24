export type OptionalFunc<TReturn, TArgs extends any[] = any[]> =
  | ((...args: TArgs) => TReturn)
  | TReturn;
