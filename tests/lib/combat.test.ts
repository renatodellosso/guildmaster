import {
  checkRetreatTriggers,
  Combat,
  CombatSide,
  handleRetreat,
  takeCombatTurn,
} from "@/lib/combat";
import { getFromOptionalFunc, Id } from "@/lib/utilTypes";
import { describe, expect, it, vi } from "vitest";
import { buildCombatSide, buildGameContext } from "../testUtils";
import { AdventurerInstance, CreatureInstance } from "@/lib/creature";

function failTest() {
  throw new Error("This function should not have been called");
}

describe(takeCombatTurn.name, () => {
  it("takes a turn for each creature", () => {
    const combat = {
      allies: buildCombatSide([
        {
          id: "instance-1",
          definitionId: "human",
          name: "Creature 1",
          hp: 10,
        },
        {
          id: "instance-2",
          definitionId: "human",
          name: "Creature 2",
          hp: 10,
        },
      ]),
      enemies: buildCombatSide([
        {
          id: "instance-3",
          definitionId: "goblin",
          name: "Creature 3",
          hp: 10,
        },
        {
          id: "instance-4",
          definitionId: "goblin",
          name: "Creature 4",
          hp: 10,
        },
      ]),
    } satisfies Combat;

    const gameContext = buildGameContext([]);

    takeCombatTurn(combat, failTest, failTest, gameContext);

    for (const creature of [
      ...combat.allies.creatures,
      ...combat.enemies.creatures,
    ]) {
      const defId: RegistryToCreatureId<typeof registryContext> = (
        creature as CreatureInstance
      ).definitionId;
      const creatureDef = registryContext.creatures[defId];
      const abilities = getFromOptionalFunc(
        creatureDef.abilities,
        creature as CreatureInstance,
        combat,
        gameContext,
        registryContext
      );

      expect(abilities).toBeDefined();
      expect(abilities!.length).toBeGreaterThan(0);

      const ability = abilities![0];
      expect(ability).toBeDefined();
      expect(ability!.activate).toHaveBeenCalledWith(
        creature,
        [],
        combat,
        gameContext,
        registryContext
      );
    }
  });

  it("always has the creature in the allies during its turn", () => {
    const registryContext = buildRegistryContext({
      creatures: {
        "creature-1": {
          id: "creature-1",
          name: "Creature 1",
          skills: {},
          abilities: [
            {
              name: "Check Side",
              description: "Checks which side it's on",
              activate: (
                caster: unknown,
                _targets: unknown,
                combat: Combat<RegistryContext>
              ) => {
                expect(combat.allies.creatures).toContain(caster);
              },
              selectTargets: () => [],
              canActivate: true,
              priority: 0,
            },
          ],
        },
      },
    });

    const combat = {
      allies: buildCombatSide([
        {
          id: "instance-1",
          definitionId: "creature-1",
          name: "Creature 1",
          hp: 10,
        },
      ]),
      enemies: buildCombatSide([
        {
          id: "instance-2",
          definitionId: "creature-1",
          name: "Creature 2",
          hp: 10,
        },
      ]),
    } satisfies Combat;

    const gameContext = buildGameContext<typeof registryContext>([]);

    takeCombatTurn(combat, failTest, failTest, gameContext, registryContext);
  });

  it("takes turns in order", () => {
    const actionOrder: Id[] = [];

    const registryContext = buildRegistryContext({
      creatures: {
        "creature-1": {
          id: "creature-1",
          name: "Creature 1",
          skills: {},
          abilities: [
            {
              name: "Record Action",
              description: "Records its action",
              activate: (caster: { id: Id }) => {
                actionOrder.push(caster.id);
              },
              selectTargets: () => [],
              canActivate: true,
              priority: 0,
            },
          ],
        },
      },
    });

    const combat = {
      allies: buildCombatSide([
        {
          id: "instance-1",
          definitionId: "creature-1",
          name: "Creature 1",
          hp: 10,
        },
        {
          id: "instance-2",
          definitionId: "creature-1",
          name: "Creature 2",
          hp: 10,
        },
      ]),
      enemies: buildCombatSide([
        {
          id: "instance-3",
          definitionId: "creature-1",
          name: "Creature 3",
          hp: 10,
        },
        {
          id: "instance-4",
          definitionId: "creature-1",
          name: "Creature 4",
          hp: 10,
        },
      ]),
    } satisfies Combat;

    const gameContext = buildGameContext<typeof registryContext>([]);

    takeCombatTurn(combat, failTest, failTest, gameContext, registryContext);

    expect(actionOrder).toEqual([
      "instance-1",
      "instance-2",
      "instance-3",
      "instance-4",
    ]);
  });

  it("works for sides with creatures in the roster", () => {
    const actionOrder: Id[] = [];

    const registryContext = buildRegistryContext({
      creatures: {
        "creature-1": {
          id: "creature-1",
          name: "Creature 1",
          skills: {},
          abilities: [
            {
              name: "Record Action",
              description: "Records its action",
              activate: (caster: { id: Id }) => {
                actionOrder.push(caster.id);
              },
              selectTargets: () => [],
              canActivate: true,
              priority: 0,
            },
          ],
        },
      },
    });

    const roster = [
      {
        id: "instance-1",
        definitionId: "creature-1",
        name: "Creature 1",
        activity: {
          definitionId: "resting",
        },
        hp: 10,
      },
      {
        id: "instance-2",
        definitionId: "creature-1",
        name: "Creature 2",
        activity: {
          definitionId: "resting",
        },
        hp: 10,
      },
      {
        id: "instance-3",
        definitionId: "creature-1",
        name: "Creature 3",
        activity: {
          definitionId: "resting",
        },
        hp: 10,
      },
      {
        id: "instance-4",
        definitionId: "creature-1",
        name: "Creature 4",
        activity: {
          definitionId: "resting",
        },
        hp: 10,
      },
    ] satisfies AdventurerInstance<typeof registryContext>[];

    const combat = {
      allies: buildCombatSide(["instance-1", "instance-2"]),
      enemies: buildCombatSide(["instance-3", "instance-4"]),
    } satisfies Combat;

    const gameContext = buildGameContext<typeof registryContext>(roster);

    takeCombatTurn(combat, failTest, failTest, gameContext, registryContext);

    expect(actionOrder).toEqual([
      "instance-1",
      "instance-2",
      "instance-3",
      "instance-4",
    ]);
  });
});

describe(checkRetreatTriggers.name, () => {
  it("returns true if any retreat trigger is activated", () => {
    const registryContext = buildRegistryContext({
      retreatTriggers: {
        "retreat-trigger-1": () => {
          return false;
        },
        "retreat-trigger-2": () => {
          return true;
        },
      },
    });

    const combat: Combat = {
      allies: {
        creatures: [],
        retreatTriggers: [
          {
            id: "instance-1",
            definitionId: "retreat-trigger-1",
          },
          {
            id: "instance-2",
            definitionId: "retreat-trigger-2",
          },
        ],
        retreatTimer: -1,
      },
      enemies: undefined as unknown as CombatSide<typeof registryContext>,
    };

    const result = checkRetreatTriggers(combat, registryContext);

    expect(result).toBe(true);
  });
});

describe(handleRetreat.name, () => {
  it("sets retreat timer when a retreat trigger is activated", () => {
    const registryContext = buildRegistryContext({
      retreatTriggers: {
        "retreat-trigger-1": () => {
          return false;
        },
        "retreat-trigger-2": () => {
          return true;
        },
      },
    });

    const combat: Combat = {
      allies: {
        creatures: [
          {
            id: "creature-1",
            definitionId: "creature-def-1",
            name: "Creature",
            hp: 10,
          },
        ],
        retreatTriggers: [
          {
            id: "instance-1",
            definitionId: "retreat-trigger-1",
          },
          {
            id: "instance-2",
            definitionId: "retreat-trigger-2",
          },
        ],
        retreatTimer: -1,
      },
      enemies: undefined as unknown as CombatSide<typeof registryContext>,
    };

    handleRetreat(
      combat,
      () => {},
      {} as GameContext<typeof registryContext>,
      registryContext
    );

    expect(combat.allies.retreatTimer).toBeGreaterThan(-1);
  });

  it("calls the retreat callback when retreat timer reaches zero", () => {
    const registryContext = buildRegistryContext({});

    const combat = {
      allies: {
        creatures: [],
        retreatTriggers: [],
        retreatTimer: 1,
      },
      enemies: undefined as unknown as CombatSide<typeof registryContext>,
    };

    const handleRetreatCallback = vi.fn();

    handleRetreat(
      combat,
      handleRetreatCallback,
      {} as GameContext,
      registryContext
    );

    expect(handleRetreatCallback).toHaveBeenCalled();
  });

  it("calls the retreat callback immediately if all allies are dead", () => {
    const registryContext = buildRegistryContext({});

    const combat: Combat = {
      allies: {
        creatures: [
          {
            id: "creature-1",
            definitionId: "creature-def-1",
            name: "Fallen Creature",
            hp: 0,
          },
        ],
        retreatTriggers: [],
        retreatTimer: -1,
      },
      enemies: undefined as unknown as CombatSide<typeof registryContext>,
    };

    const handleRetreatCallback = vi.fn();

    handleRetreat(
      combat,
      handleRetreatCallback,
      {} as GameContext,
      registryContext
    );

    expect(handleRetreatCallback).toHaveBeenCalled();
  });
});
