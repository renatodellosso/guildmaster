import { Table } from "@/lib/table";
import { describe, expect, it } from "vitest";

describe(Table.name, () => {
  describe(Table.prototype.roll.name, () => {
    it("should return an item based on weight", () => {
      const items = [
        { weight: 1, item: "common" },
        { weight: 3, item: "uncommon" },
        { weight: 6, item: "rare" },
      ];
      const table = new Table(items);

      const results: Record<string, number> = {
        common: 0,
        uncommon: 0,
        rare: 0,
      };

      const iterations = 10000;
      for (let i = 0; i < iterations; i++) {
        const item = table.roll();
        results[item]++;
      }

      // Check that the distribution roughly matches the weights
      const commonRatio = results["common"] / iterations;
      const uncommonRatio = results["uncommon"] / iterations;
      const rareRatio = results["rare"] / iterations;

      // Expected ratios are approximately 0.1, 0.3, 0.6
      expect(commonRatio).toBeGreaterThan(0.05);
      expect(commonRatio).toBeLessThan(0.15);
      expect(uncommonRatio).toBeGreaterThan(0.25);
      expect(uncommonRatio).toBeLessThan(0.35);
      expect(rareRatio).toBeGreaterThan(0.55);
      expect(rareRatio).toBeLessThan(0.65);
    });
  });

  describe(Table.prototype.rollMultiple.name, () => {
    it("should return multiple items", () => {
      const items = [
        { weight: 1, item: "common" },
        { weight: 1, item: "uncommon" },
        { weight: 1, item: "rare" },
      ];
      const table = new Table(items);

      const count = 5;
      const results = table.rollMultiple(count);

      expect(results.length).toBe(count);
      for (const item of results) {
        expect(["common", "uncommon", "rare"]).toContain(item);
      }
    });
  });
});
