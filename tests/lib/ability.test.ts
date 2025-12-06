import {
  Ability,
  AbilityWithSource,
  getCastableAbilities,
  getHighestPriorityAbilities,
  selectAbilityForCreature,
  selectAbilityFromList,
} from "@/lib/ability";
import { AbilityPriority } from "@/lib/abilityPriority";
import { describe, expect, expectTypeOf, it } from "vitest";
import { CreatureInstance, CreatureProviderSource } from "@/lib/creature";
import { creatures } from "@/lib/content/creatures";
import { GameContext } from "@/lib/gameContext";
import { Expedition } from "@/lib/expedition";
import { buildCreatureInstance } from "../testUtils";

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

    expectTypeOf<CastableAbilities>().toEqualTypeOf<AbilityWithSource[]>();

    const ability1: Ability = {
      name: "Castable Ability",
      description: "A castable ability",
      activate: () => {},
      selectTargets: () => [],
      canActivate: true,
      priority: 50,
    };

    const ability2: Ability = {
      name: "Non-Castable Ability",
      description: "A non-castable ability",
      activate: () => {},
      selectTargets: () => [],
      canActivate: false,
      priority: 50,
    };

    creatures.human.abilities = [ability1, ability2];

    const castableAbilities = getCastableAbilities(
      buildCreatureInstance({
        definitionId: "human",
        id: "instance-1",
        name: "Test Creature",
        hp: 10,
      }),
      {} as Expedition,
      {} as GameContext
    );

    expect(castableAbilities.map((a) => a.ability)).toEqual([ability1]);
  });
});

describe(getHighestPriorityAbilities.name, () => {
  it("returns abilities with the highest priority", () => {
    const ability1: Ability = {
      name: "Ability 1",
      description: "First ability",
      activate: () => {},
      selectTargets: () => [],
      canActivate: true,
      priority: AbilityPriority.High,
    };

    const ability2: Ability = {
      name: "Ability 2",
      description: "Second ability",
      activate: () => {},
      selectTargets: () => [],
      canActivate: true,
      priority: AbilityPriority.Medium,
    };

    const ability3: Ability = {
      name: "Ability 3",
      description: "Third ability",
      activate: () => {},
      selectTargets: () => [],
      canActivate: true,
      priority: AbilityPriority.High,
    };

    const abilities = [ability1, ability2, ability3].map((ability) => ({
      ability,
      source: undefined as unknown as CreatureProviderSource,
    }));

    const highestPriorityAbilities = getHighestPriorityAbilities(
      abilities,
      {} as CreatureInstance,
      [],
      {} as Expedition,
      {} as GameContext
    );

    expect(highestPriorityAbilities.map((a) => a.ability)).toEqual([
      ability1,
      ability3,
    ]);
  });
});

describe(selectAbilityFromList.name, () => {
  it("selects an ability from a list", () => {
    const ability1: Ability = {
      name: "Ability 1",
      description: "First ability",
      activate: () => {},
      selectTargets: () => [],
      canActivate: true,
      priority: AbilityPriority.High,
    };

    const ability2: Ability = {
      name: "Ability 2",
      description: "Second ability",
      activate: () => {},
      selectTargets: () => [],
      canActivate: true,
      priority: AbilityPriority.High,
    };

    const abilities = [ability1, ability2].map((ability) => ({
      ability,
      source: undefined as unknown as CreatureProviderSource,
    }));

    const selectedAbility = selectAbilityFromList(abilities);

    expect(abilities).toContain(selectedAbility);
  });

  it("returns undefined for an empty list", () => {
    const abilities: AbilityWithSource[] = [];

    const selectedAbility = selectAbilityFromList(abilities);

    expect(selectedAbility).toBeUndefined();
  });
});

describe(selectAbilityForCreature.name, () => {
  it("selects an ability for a creature", () => {
    const ability1: Ability = {
      name: "Ability 1",
      description: "First ability",
      activate: () => {},
      selectTargets: () => [],
      canActivate: true,
      priority: AbilityPriority.High,
    };

    const ability2: Ability = {
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
      buildCreatureInstance({
        definitionId: "human",
        id: "instance-1",
        name: "Test Creature",
        hp: 10,
      }),
      {} as Expedition,
      {} as GameContext
    );

    expectTypeOf(selectedAbility).toExtend<AbilityWithSource | undefined>();
    expect(abilities).toContain(selectedAbility!.ability);
  });

  it("returns undefined if the creature has no abilities", () => {
    creatures.human.abilities = [];

    const selectedAbility = selectAbilityForCreature(
      buildCreatureInstance({
        definitionId: "human",
        id: "instance-1",
        name: "Test Creature",
        hp: 10,
      }),
      {} as Expedition,
      {} as GameContext
    );

    expect(selectedAbility).toBeUndefined();
  });

  it("only selects castable abilities", () => {
    const ability1: Ability = {
      name: "Castable Ability",
      description: "A castable ability",
      activate: () => {},
      selectTargets: () => [],
      canActivate: true,
      priority: AbilityPriority.High,
    };

    const ability2: Ability = {
      name: "Non-Castable Ability",
      description: "A non-castable ability",
      activate: () => {},
      selectTargets: () => [],
      canActivate: false,
      priority: AbilityPriority.High,
    };

    creatures.human.abilities = [ability1, ability2];

    const selectedAbility = selectAbilityForCreature(
      buildCreatureInstance({
        definitionId: "human",
        id: "instance-1",
        name: "Test Creature",
        hp: 10,
      }),
      {} as Expedition,
      {} as GameContext
    );

    expectTypeOf(selectedAbility).toExtend<AbilityWithSource | undefined>();
    expect(selectedAbility?.ability).toEqual(ability1);
  });

  it("only selects abilities with the highest priority", () => {
    const ability1: Ability = {
      name: "High Priority Ability",
      description: "A high priority ability",
      activate: () => {},
      selectTargets: () => [],
      canActivate: true,
      priority: AbilityPriority.High,
    };

    const ability2: Ability = {
      name: "Low Priority Ability",
      description: "A low priority ability",
      activate: () => {},
      selectTargets: () => [],
      canActivate: true,
      priority: AbilityPriority.Low,
    };

    creatures.human.abilities = [ability1, ability2];

    const selectedAbility = selectAbilityForCreature(
      buildCreatureInstance({
        definitionId: "human",
        id: "instance-1",
        name: "Test Creature",
        hp: 10,
      }),
      {} as Expedition,
      {} as GameContext
    );

    expectTypeOf(selectedAbility).toExtend<AbilityWithSource | undefined>();
    expect(selectedAbility?.ability).toEqual(ability1);
  });
});
