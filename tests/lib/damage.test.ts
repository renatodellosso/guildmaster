import { DamageType, getDamageAfterResistances, mergeDamages, mergeResistances } from "@/lib/damage";
import { round } from "@/lib/utils";
import { describe, expect, it } from "vitest";

describe(mergeDamages.name, () => {
  it("merges damages of the same type", () => {
    const damages = [
      { type: DamageType.Bludgeoning, amount: 10 },
      { type: DamageType.Fire, amount: 5 },
      { type: DamageType.Bludgeoning, amount: 15 },
    ];
    const merged = mergeDamages(damages);
    expect(merged).toEqual([
      { type: DamageType.Bludgeoning, amount: 25 },
      { type: DamageType.Fire, amount: 5 },
    ]);
  });
});

describe(mergeResistances.name, () => {
  it("merges resistances correctly", () => {
    const resistancesList = [
      { [DamageType.Fire]: 0.2, [DamageType.Cold]: 0.1 },
      { [DamageType.Fire]: 0.3, [DamageType.Poison]: 0.5 },
    ];
    const merged = mergeResistances(resistancesList);

    // Round to 2 decimal places for easier comparison
    for (const key in merged) {
      merged[key as DamageType] =
        round(merged[key as DamageType] as number, 2);
    }

    expect(merged).toEqual({
      [DamageType.Fire]: 0.44, // 1 - (1 - 0.2) * (1 - 0.3) = 0.44
      [DamageType.Cold]: 0.1,
      [DamageType.Poison]: 0.5,
    });
  });
});

describe(getDamageAfterResistances.name, () => {
  it("calculates final damage after resistances", () => {
    const damages = [
      { type: DamageType.Fire, amount: 100 },
      { type: DamageType.Cold, amount: 50 },
    ];
    const resistances = {
      [DamageType.Fire]: 0.3, // 30% resistance
      [DamageType.Cold]: 0.2, // 20% resistance
    };
    const finalDamages = getDamageAfterResistances(damages, resistances);

    // Round to 2 decimal places for easier comparison
    for (const damage of finalDamages) {
      damage.amount = round(damage.amount, 2);
    }

    expect(finalDamages).toEqual([
      { type: DamageType.Fire, amount: 70 }, // 100 * (1 - 0.3) = 70
      { type: DamageType.Cold, amount: 40 }, // 50 * (1 - 0.2) = 40
    ]);
  });
});
