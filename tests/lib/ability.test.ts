import {
  Ability,
  AbilityPriority,
  getAbilities,
  getCastableAbilities,
  getHighestPriorityAbilities,
  selectAbilityForCreature,
  selectAbilityFromList,
} from "@/lib/ability";
import { describe, expect, expectTypeOf, it } from "vitest";
import { buildRegistryContext } from "../testUtils";

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

    const registryContext = buildRegistryContext({
      creatures: {
        "creature-1": {
          id: "creature-1",
          name: "Test Creature",
          skills: {},
          abilities: [ability],
        },
      },
    });

    const abilities = getAbilities<any>(
      {
        definitionId: "creature-1",
        id: "instance-1",
        hp: 10,
      },
      {} as any,
      {} as any,
      registryContext
    );

    expectTypeOf(abilities).toEqualTypeOf<Ability<any>[]>();
    expect(abilities).toEqual([ability]);
  });
});

describe(getCastableAbilities.name, () => {
  it("returns only castable abilities", () => {
    type CastableAbilities = ReturnType<typeof getCastableAbilities<any>>;

    expectTypeOf<CastableAbilities>().toEqualTypeOf<Ability<any>[]>();

    const ability1 = {
      name: "Castable Ability",
      description: "A castable ability",
      activate: () => {},
      selectTargets: () => [],
      canActivate: true,
      priority: 50,
    };

    const ability2 = {
      name: "Non-Castable Ability",
      description: "A non-castable ability",
      activate: () => {},
      selectTargets: () => [],
      canActivate: false,
      priority: 50,
    };

    const registryContext = buildRegistryContext({
      creatures: {
        "creature-1": {
          id: "creature-1",
          name: "Test Creature",
          skills: {},
          abilities: [ability1, ability2],
        },
      },
    });

    const castableAbilities = getCastableAbilities<any>(
      {
        definitionId: "creature-1",
        id: "instance-1",
        hp: 10,
      },
      {} as any,
      {} as any,
      registryContext
    );

    expectTypeOf(castableAbilities).toEqualTypeOf<Ability<any>[]>();
    expect(castableAbilities).toEqual([ability1]);
  });
});

describe(getHighestPriorityAbilities.name, () => {
  it("returns abilities with the highest priority", () => {
    const ability1: Ability<any> = {
      name: "Ability 1",
      description: "First ability",
      activate: () => {},
      selectTargets: () => [],
      canActivate: true,
      priority: AbilityPriority.High,
    };

    const ability2: Ability<any> = {
      name: "Ability 2",
      description: "Second ability",
      activate: () => {},
      selectTargets: () => [],
      canActivate: true,
      priority: AbilityPriority.Medium,
    };

    const ability3: Ability<any> = {
      name: "Ability 3",
      description: "Third ability",
      activate: () => {},
      selectTargets: () => [],
      canActivate: true,
      priority: AbilityPriority.High,
    };

    const abilities = [ability1, ability2, ability3];

    const highestPriorityAbilities = getHighestPriorityAbilities(
      abilities,
      {} as any,
      [],
      {} as any,
      {} as any,
      {} as any
    );

    expectTypeOf(highestPriorityAbilities).toEqualTypeOf<Ability<any>[]>();
    expect(highestPriorityAbilities).toEqual([ability1, ability3]);
  });
});

describe(selectAbilityFromList.name, () => {
  it("selects an ability from a list", () => {
    const ability1: Ability<any> = {
      name: "Ability 1",
      description: "First ability",
      activate: () => {},
      selectTargets: () => [],
      canActivate: true,
      priority: AbilityPriority.High,
    };

    const ability2: Ability<any> = {
      name: "Ability 2",
      description: "Second ability",
      activate: () => {},
      selectTargets: () => [],
      canActivate: true,
      priority: AbilityPriority.High,
    };

    const abilities = [ability1, ability2];

    const selectedAbility = selectAbilityFromList(abilities);

    expectTypeOf(selectedAbility).toEqualTypeOf<Ability<any> | undefined>();
    expect(abilities).toContain(selectedAbility!);
  });

  it("returns undefined for an empty list", () => {
    const abilities: Ability<any>[] = [];

    const selectedAbility = selectAbilityFromList(abilities);

    expect(selectedAbility).toBeUndefined();
  });
});

describe(selectAbilityForCreature.name, () => {
  it("selects an ability for a creature", () => {
    const ability1: Ability<any> = {
      name: "Ability 1",
      description: "First ability",
      activate: () => {},
      selectTargets: () => [],
      canActivate: true,
      priority: AbilityPriority.High,
    };

    const ability2: Ability<any> = {
      name: "Ability 2",
      description: "Second ability",
      activate: () => {},
      selectTargets: () => [],
      canActivate: true,
      priority: AbilityPriority.High,
    };

    const abilities = [ability1, ability2];

    const registryContext = buildRegistryContext({
      creatures: {
        "creature-1": {
          id: "creature-1",
          name: "Test Creature",
          skills: {},
          abilities: [ability1, ability2],
        },
      },
    });

    const selectedAbility = selectAbilityForCreature(
      { definitionId: "creature-1", id: "instance-1", hp: 10 },
      {} as any,
      {} as any,
      registryContext
    );

    expectTypeOf(selectedAbility).toExtend<Ability<any> | undefined>();
    expect(abilities).toContain(selectedAbility!);
  });

  it("returns undefined if the creature has no abilities", () => {
    const registryContext = buildRegistryContext({
      creatures: {
        "creature-1": {
          id: "creature-1",
          name: "Test Creature",
          skills: {},
          abilities: [],
        },
      },
    });

    const selectedAbility = selectAbilityForCreature(
      { definitionId: "creature-1", id: "instance-1", hp: 10 },
      {} as any,
      {} as any,
      registryContext
    );

    expect(selectedAbility).toBeUndefined();
  });

  it("only selects castable abilities", () => {
    const ability1: Ability<any> = {
      name: "Castable Ability",
      description: "A castable ability",
      activate: () => {},
      selectTargets: () => [],
      canActivate: true,
      priority: AbilityPriority.High,
    };

    const ability2: Ability<any> = {
      name: "Non-Castable Ability",
      description: "A non-castable ability",
      activate: () => {},
      selectTargets: () => [],
      canActivate: false,
      priority: AbilityPriority.High,
    };

    const registryContext = buildRegistryContext({
      creatures: {
        "creature-1": {
          id: "creature-1",
          name: "Test Creature",
          skills: {},
          abilities: [ability1, ability2],
        },
      },
    });

    const selectedAbility = selectAbilityForCreature(
      { definitionId: "creature-1", id: "instance-1", hp: 10 },
      {} as any,
      {} as any,
      registryContext
    );

    expectTypeOf(selectedAbility).toExtend<Ability<any> | undefined>();
    expect(selectedAbility).toEqual(ability1);
  });

  it("only selects abilities with the highest priority", () => {
    const ability1: Ability<any> = {
      name: "High Priority Ability",
      description: "A high priority ability",
      activate: () => {},
      selectTargets: () => [],
      canActivate: true,
      priority: AbilityPriority.High,
    };

    const ability2: Ability<any> = {
      name: "Low Priority Ability",
      description: "A low priority ability",
      activate: () => {},
      selectTargets: () => [],
      canActivate: true,
      priority: AbilityPriority.Low,
    };

    const registryContext = buildRegistryContext({
      creatures: {
        "creature-1": {
          id: "creature-1",
          name: "Test Creature",
          skills: {},
          abilities: [ability1, ability2],
        },
      },
    });

    const selectedAbility = selectAbilityForCreature(
      { definitionId: "creature-1", id: "instance-1", hp: 10 },
      {} as any,
      {} as any,
      registryContext
    );

    expectTypeOf(selectedAbility).toExtend<Ability<any> | undefined>();
    expect(selectedAbility).toEqual(ability1);
  });
});
