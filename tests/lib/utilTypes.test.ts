import { describe, expectTypeOf, it } from "vitest";
import { OptionalFunc } from "../../lib/utilTypes";

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
