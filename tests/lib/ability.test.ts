import {
  Ability,
  AbilityPriority,
  getCastableAbilities,
  getHighestPriorityAbilities,
  selectAbilityForCreature,
  selectAbilityFromList,
} from "@/lib/ability";
import { describe, expect, expectTypeOf, it } from "vitest";
import { Combat } from "@/lib/combat";
import { CreatureInstance } from "@/lib/creature";
import { creatures } from "@/lib/content/creatures";
import { GameContext } from "@/lib/gameContext";

describe("Ability", () => {
  it("allows arbitrary priority functions", () => {
    type Func = (
      caster: unknown,
      targets: unknown,
      combat: unknown,
      registryContext: unknown
    ) => number;

    type Priority = Ability["priority"];

    expectTypeOf<Func>().toExtend<Priority>();
  });

  it("allows arbitrary priority values", () => {
    type Value = number;

    type Priority = Ability["priority"];

    expectTypeOf<Value>().toExtend<Priority>();
  });
});

describe(getCastableAbilities.name, () => {
  it("returns only castable abilities", () => {
    type CastableAbilities = ReturnType<typeof getCastableAbilities>;

    expectTypeOf<CastableAbilities>().toEqualTypeOf<Ability[]>();

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

    creatures.human.abilities = [ability1, ability2];

    const castableAbilities = getCastableAbilities(
      {
        definitionId: "human",
        id: "instance-1",
        name: "Test Creature",
        hp: 10,
      },
      {} as Combat,
      {} as GameContext
    );

    expect(castableAbilities).toEqual([ability1]);
  });
});

describe(getHighestPriorityAbilities.name, () => {
  it("returns abilities with the highest priority", () => {
    const ability1 = {
      name: "Ability 1",
      description: "First ability",
      activate: () => {},
      selectTargets: () => [],
      canActivate: true,
      priority: AbilityPriority.High,
    };

    const ability2 = {
      name: "Ability 2",
      description: "Second ability",
      activate: () => {},
      selectTargets: () => [],
      canActivate: true,
      priority: AbilityPriority.Medium,
    };

    const ability3 = {
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
      {} as CreatureInstance,
      [],
      {} as Combat,
      {} as GameContext
    );

    expect(highestPriorityAbilities).toEqual([ability1, ability3]);
  });
});

describe(selectAbilityFromList.name, () => {
  it("selects an ability from a list", () => {
    const ability1 = {
      name: "Ability 1",
      description: "First ability",
      activate: () => {},
      selectTargets: () => [],
      canActivate: true,
      priority: AbilityPriority.High,
    };

    const ability2 = {
      name: "Ability 2",
      description: "Second ability",
      activate: () => {},
      selectTargets: () => [],
      canActivate: true,
      priority: AbilityPriority.High,
    };

    const abilities = [ability1, ability2];

    const selectedAbility = selectAbilityFromList(abilities);

    expect(abilities).toContain(selectedAbility!);
  });

  it("returns undefined for an empty list", () => {
    const abilities: Ability[] = [];

    const selectedAbility = selectAbilityFromList(abilities);

    expect(selectedAbility).toBeUndefined();
  });
});

describe(selectAbilityForCreature.name, () => {
  it("selects an ability for a creature", () => {
    const ability1 = {
      name: "Ability 1",
      description: "First ability",
      activate: () => {},
      selectTargets: () => [],
      canActivate: true,
      priority: AbilityPriority.High,
    };

    const ability2 = {
      name: "Ability 2",
      description: "Second ability",
      activate: () => {},
      selectTargets: () => [],
      canActivate: true,
      priority: AbilityPriority.High,
    };

    const abilities = [ability1, ability2];

    creatures.human.abilities = abilities;

    const selectedAbility = selectAbilityForCreature(
      {
        definitionId: "human",
        id: "instance-1",
        name: "Test Creature",
        hp: 10,
      },
      {} as Combat,
      {} as GameContext
    );

    expectTypeOf(selectedAbility).toExtend<Ability | undefined>();
    expect(abilities).toContain(selectedAbility!);
  });

  it("returns undefined if the creature has no abilities", () => {
    creatures.human.abilities = [];

    const selectedAbility = selectAbilityForCreature(
      {
        definitionId: "human",
        id: "instance-1",
        name: "Test Creature",
        hp: 10,
      },
      {} as Combat,
      {} as GameContext
    );

    expect(selectedAbility).toBeUndefined();
  });

  it("only selects castable abilities", () => {
    const ability1 = {
      name: "Castable Ability",
      description: "A castable ability",
      activate: () => {},
      selectTargets: () => [],
      canActivate: true,
      priority: AbilityPriority.High,
    };

    const ability2 = {
      name: "Non-Castable Ability",
      description: "A non-castable ability",
      activate: () => {},
      selectTargets: () => [],
      canActivate: false,
      priority: AbilityPriority.High,
    };

    creatures.human.abilities = [ability1, ability2];

    const selectedAbility = selectAbilityForCreature(
      {
        definitionId: "human",
        id: "instance-1",
        name: "Test Creature",
        hp: 10,
      },
      {} as Combat,
      {} as GameContext
    );

    expectTypeOf(selectedAbility).toExtend<Ability | undefined>();
    expect(selectedAbility).toEqual(ability1);
  });

  it("only selects abilities with the highest priority", () => {
    const ability1 = {
      name: "High Priority Ability",
      description: "A high priority ability",
      activate: () => {},
      selectTargets: () => [],
      canActivate: true,
      priority: AbilityPriority.High,
    };

    const ability2 = {
      name: "Low Priority Ability",
      description: "A low priority ability",
      activate: () => {},
      selectTargets: () => [],
      canActivate: true,
      priority: AbilityPriority.Low,
    };

    creatures.human.abilities = [ability1, ability2];

    const selectedAbility = selectAbilityForCreature(
      {
        definitionId: "human",
        id: "instance-1",
        name: "Test Creature",
        hp: 10,
      },
      {} as Combat,
      {} as GameContext
    );

    expectTypeOf(selectedAbility).toExtend<Ability | undefined>();
    expect(selectedAbility).toEqual(ability1);
  });
});
