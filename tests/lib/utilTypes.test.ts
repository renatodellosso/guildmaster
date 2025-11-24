import { describe, expect, expectTypeOf, it } from "vitest";
import { getFromOptionalFunc, OptionalFunc } from "@/lib/utilTypes";

describe("OptionalFunc", () => {
  it("allows functions", () => {
    expectTypeOf<() => number>().toExtend<OptionalFunc<number>>();
  });

  it("allows return types directly", () => {
    expectTypeOf<number>().toExtend<OptionalFunc<number>>();
  });

  it("allows functions with arguments", () => {
    expectTypeOf<(a: string, b: boolean) => string[]>().toExtend<
      OptionalFunc<string[], [string, boolean]>
    >();
  });
});

describe(getFromOptionalFunc.name, () => {
  it("returns the result of the function when a function is provided", () => {
    const func: OptionalFunc<number, [number, number]> = (a, b) => a + b;
    const result = getFromOptionalFunc(func, 2, 3);
    expectTypeOf(result).toEqualTypeOf<number>();
    expect(result).toBe(5);
  });

  it("returns the value directly when a value is provided", () => {
    const value: OptionalFunc<string> = "hello";
    const result = getFromOptionalFunc(value);
    expectTypeOf(result).toEqualTypeOf<string>();
    expect(result).toBe("hello");
  });
});
