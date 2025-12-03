import { chooseRandom } from "@/lib/utils";
import { describe, expect, it } from "vitest";

describe(chooseRandom.name, () => {
  it("should return an element from the array", () => {
    const arr = [1, 2, 3, 4, 5];
    const result = chooseRandom(arr);

    expect(arr).toContain(result);
  });

  it("returns undefined for an empty array", () => {
    const arr: number[] = [];
    const result = chooseRandom(arr);

    expect(result).toBeUndefined();
  });
});
