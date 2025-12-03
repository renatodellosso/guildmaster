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
import { GameContext } from "@/lib/gameContext";
import { Combat } from "@/lib/combat";
import {
  GameContext,
  MainRegistryContext,
} from "@/lib/content/mainRegistryContext";
import { CreatureInstance } from "@/lib/creature";

describe("Ability", () => {
  it("allows arbitrary priority functions", () => {
    type Func = (
      caster: unknown,
      targets: unknown,
      combat: unknown,
      registryContext: unknown
    ) => number;

    type Priority = Ability<MainRegistryContext>["priority"];

    expectTypeOf<Func>().toExtend<Priority>();
  });

  it("allows arbitrary priority values", () => {
    type Value = number;

    type Priority = Ability<MainRegistryContext>["priority"];

    expectTypeOf<Value>().toExtend<Priority>();
  });
});

describe(getAbilities.name, () => {
  it("returns an array of abilities", () => {
    type Abilities = ReturnType<typeof getAbilities<typeof registryContext>>;

    expectTypeOf<Abilities>().toEqualTypeOf<
      Ability<typeof registryContext>[]
    >();

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

    const abilities = getAbilities<typeof registryContext>(
      {
        definitionId: "creature-1",
        id: "instance-1",
        name: "Test Creature",
        hp: 10,
      },
      {} as Combat<typeof registryContext>,
      {} as GameContext<typeof registryContext>,
      registryContext
    );

    expect(abilities).toEqual([ability]);
  });
});

describe(getCastableAbilities.name, () => {
  it("returns only castable abilities", () => {
    type CastableAbilities = ReturnType<
      typeof getCastableAbilities<typeof registryContext>
    >;

    expectTypeOf<CastableAbilities>().toEqualTypeOf<
      Ability<typeof registryContext>[]
    >();

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

    const castableAbilities = getCastableAbilities<typeof registryContext>(
      {
        definitionId: "creature-1",
        id: "instance-1",
        name: "Test Creature",
        hp: 10,
      },
      {} as Combat<typeof registryContext>,
      {} as GameContext<typeof registryContext>,
      registryContext
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
      {} as CreatureInstance<MainRegistryContext>,
      [],
      {} as Combat<MainRegistryContext>,
      {} as GameContext,
      {} as MainRegistryContext
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
    const abilities: Ability<MainRegistryContext>[] = [];

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
      {
        definitionId: "creature-1",
        id: "instance-1",
        name: "Test Creature",
        hp: 10,
      },
      {} as Combat<typeof registryContext>,
      {} as GameContext<typeof registryContext>,
      registryContext
    );

    expectTypeOf(selectedAbility).toExtend<
      Ability<typeof registryContext> | undefined
    >();
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
      {
        definitionId: "creature-1",
        id: "instance-1",
        name: "Test Creature",
        hp: 10,
      },
      {} as Combat<typeof registryContext>,
      {} as GameContext<typeof registryContext>,
      registryContext
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
      {
        definitionId: "creature-1",
        id: "instance-1",
        name: "Test Creature",
        hp: 10,
      },
      {} as Combat<typeof registryContext>,
      {} as GameContext<typeof registryContext>,
      registryContext
    );

    expectTypeOf(selectedAbility).toExtend<
      Ability<typeof registryContext> | undefined
    >();
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
      {
        definitionId: "creature-1",
        id: "instance-1",
        name: "Test Creature",
        hp: 10,
      },
      {} as Combat<typeof registryContext>,
      {} as GameContext<typeof registryContext>,
      registryContext
    );

    expectTypeOf(selectedAbility).toExtend<
      Ability<typeof registryContext> | undefined
    >();
    expect(selectedAbility).toEqual(ability1);
  });
});
