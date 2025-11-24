import { Ability, getAbilities } from "@/lib/ability";
import { describe, expect, expectTypeOf, it } from "vitest";

describe("Ability", () => {
  it("allows arbitrary priority functions", () => {
    type Func = (
      caster: any,
      targets: any,
      combat: any,
      registryContext: any
    ) => number;

    type Priority = Ability<any>["priority"];

    expectTypeOf<Func>().toExtend<Priority>();
  });

  it("allows arbitrary priority values", () => {
    type Value = number;

    type Priority = Ability<any>["priority"];

    expectTypeOf<Value>().toExtend<Priority>();
  });
});

describe(getAbilities.name, () => {
  it("returns an array of abilities", () => {
    type Abilities = ReturnType<typeof getAbilities<any>>;

    expectTypeOf<Abilities>().toEqualTypeOf<Ability<any>[]>();

    const ability = {
      name: "Test Ability",
      description: "A test ability",
      activate: () => {},
      selectTargets: () => [],
      canActivate: true,
      priority: 50,
    };

    const registryContext = {
      creatures: {
        "creature-1": {
          id: "creature-1",
          name: "Test Creature",
          skills: {},
          abilities: [ability],
        },
      },
    };

    const abilities = getAbilities<any>(
      {
        definitionId: "creature-1",
        id: "instance-1",
        hp: 10,
      },
      {} as any,
      registryContext
    );

    expectTypeOf(abilities).toEqualTypeOf<Ability<any>[]>();
    expect(abilities).toEqual([ability]);
  });
});
