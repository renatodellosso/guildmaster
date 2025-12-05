import {
  checkRetreatTriggers,
  Combat,
  CombatSide,
  handleRetreat,
  takeCombatTurn,
} from "@/lib/combat";
import { getFromOptionalFunc, Id } from "@/lib/utilTypes";
import { describe, expect, it, vi } from "vitest";
import { buildAdventurerInstance, buildCombatSide, buildCreatureInstance, buildGameContext, failTest } from "../testUtils";
import { AdventurerInstance, CreatureInstance } from "@/lib/creature";
import { CreatureDefId, creatures } from "@/lib/content/creatures";
import { GameContext } from "@/lib/gameContext";
import { AbilityPriority } from "@/lib/ability";
import { Expedition } from "@/lib/expedition";

describe(takeCombatTurn.name, () => {
  it("takes a turn for each creature", () => {
    creatures.human.abilities = [
      {
        name: "Basic Attack",
        activate: vi.fn(),
        description: "",
        selectTargets: () => [],
        canActivate: true,
        priority: AbilityPriority.Low,
      },
    ];

    const combat = {
      allies: buildCombatSide([
        buildCreatureInstance({
          id: "instance-1",
          definitionId: "human",
          name: "Creature 1",
          hp: 10,
        }),
        buildCreatureInstance({
          id: "instance-2",
          definitionId: "human",
          name: "Creature 2",
          hp: 10,
        }),
      ]),
      enemies: buildCombatSide([
        buildCreatureInstance({
          id: "instance-3",
          definitionId: "human",
          name: "Creature 3",
          hp: 10,
        }),
        buildCreatureInstance({
          id: "instance-4",
          definitionId: "human",
          name: "Creature 4",
          hp: 10,
        }),
      ]),
    } satisfies Combat;

    const gameContext = buildGameContext([]);

    takeCombatTurn(
      {
        combat,
      } as Expedition,
      failTest,
      failTest,
      gameContext
    );

    for (const creature of [
      ...combat.allies.creatures,
      ...combat.enemies.creatures,
    ]) {
      const defId: CreatureDefId = (creature as CreatureInstance).definitionId;
      const creatureDef = creatures[defId];
      const abilities = getFromOptionalFunc(
        creatureDef.abilities,
        creature as CreatureInstance,
        {
          combat,
        } as unknown as Expedition,
        gameContext
      );

      expect(abilities).toBeDefined();
      expect(abilities!.length).toBeGreaterThan(0);

      const ability = abilities![0];
      expect(ability).toBeDefined();
      expect(ability!.activate).toHaveBeenCalledWith(
        creature,
        [],
        { combat },
        gameContext
      );
    }
  });

  it("always has the creature in the allies during its turn", () => {
    const combat = {
      allies: buildCombatSide([
        buildCreatureInstance({
          id: "instance-1",
          definitionId: "human",
          name: "Creature 1",
          hp: 10,
        }),
      ]),
      enemies: buildCombatSide([
        buildCreatureInstance({
          id: "instance-2",
          definitionId: "human",
          name: "Creature 2",
          hp: 10,
        }),
      ]),
    } satisfies Combat;

    const gameContext = buildGameContext([]);

    takeCombatTurn({ combat } as Expedition, failTest, failTest, gameContext);
  });

  it("takes turns in order", () => {
    const actionOrder: Id[] = [];

    creatures.human.abilities = [
      {
        name: "Basic Attack",
        activate: vi.fn((creature) => {
          actionOrder.push(creature.id);
        }),
        description: "",
        selectTargets: () => [],
        canActivate: true,
        priority: AbilityPriority.Low,
      },
    ];

    const combat = {
      allies: buildCombatSide([
        buildCreatureInstance({
          id: "instance-1",
          definitionId: "human",
          name: "Creature 1",
          hp: 10,
        }),
        buildCreatureInstance({
          id: "instance-2",
          definitionId: "human",
          name: "Creature 2",
          hp: 10,
        }),
      ]),
      enemies: buildCombatSide([
        buildCreatureInstance({
          id: "instance-3",
          definitionId: "human",
          name: "Creature 3",
          hp: 10,
        }),
        buildCreatureInstance({
          id: "instance-4",
          definitionId: "human",
          name: "Creature 4",
          hp: 10,
        }),
      ]),
    } satisfies Combat;

    const gameContext = buildGameContext([]);

    takeCombatTurn({ combat } as Expedition, failTest, failTest, gameContext);

    expect(actionOrder).toEqual([
      "instance-1",
      "instance-2",
      "instance-3",
      "instance-4",
    ]);
  });

  it("works for sides with creatures in the roster", () => {
    const actionOrder: Id[] = [];

    creatures.human.abilities = [
      {
        name: "Basic Attack",
        activate: vi.fn((creature) => {
          actionOrder.push(creature.id);
        }),
        description: "",
        selectTargets: () => [],
        canActivate: true,
        priority: AbilityPriority.Low,
      },
    ];

    const roster = [
      buildAdventurerInstance({
        id: "instance-1",
        definitionId: "human",
        name: "Creature 1",
        activity: {
          definitionId: "resting",
        },
        hp: 10,
        xp: 0,
        level: 1,
        skills: {},
      }),
      buildAdventurerInstance({
        id: "instance-2",
        definitionId: "human",
        name: "Creature 2",
        activity: {
          definitionId: "resting",
        },
        hp: 10,
        xp: 0,
        level: 1,
        skills: {},
      }),
      buildAdventurerInstance({
        id: "instance-3",
        definitionId: "human",
        name: "Creature 3",
        activity: {
          definitionId: "resting",
        },
        hp: 10,
        xp: 0,
        level: 1,
        skills: {},
      }),
      buildAdventurerInstance({
        id: "instance-4",
        definitionId: "human",
        name: "Creature 4",
        activity: {
          definitionId: "resting",
        },
        hp: 10,
        xp: 0,
        level: 1,
        skills: {},
      }),
    ] satisfies AdventurerInstance[];

    const combat = {
      allies: buildCombatSide(["instance-1", "instance-2"]),
      enemies: buildCombatSide(["instance-3", "instance-4"]),
    } satisfies Combat;

    const gameContext = buildGameContext(roster);

    takeCombatTurn({ combat } as Expedition, failTest, failTest, gameContext);

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
    const combat: Combat = {
      allies: {
        creatures: [],
        retreatTriggers: [
          {
            id: "instance-1",
            definitionId: "alwaysRetreat",
          },
          {
            id: "instance-2",
            definitionId: "neverRetreat",
          },
        ],
        retreatTimer: -1,
      },
      enemies: undefined as unknown as CombatSide,
    };

    const result = checkRetreatTriggers(combat);

    expect(result).toBe(true);
  });
});

describe(handleRetreat.name, () => {
  it("sets retreat timer when a retreat trigger is activated", () => {
    const combat: Combat = {
      allies: {
        creatures: [
          buildCreatureInstance({
            id: "creature-1",
            definitionId: "human",
            name: "Creature",
            hp: 10,
          }),
        ],
        retreatTriggers: [
          {
            id: "instance-1",
            definitionId: "alwaysRetreat",
          },
          {
            id: "instance-2",
            definitionId: "neverRetreat",
          },
        ],
        retreatTimer: -1,
      },
      enemies: undefined as unknown as CombatSide,
    };

    handleRetreat(combat, () => {}, {} as GameContext);

    expect(combat.allies.retreatTimer).toBeGreaterThan(-1);
  });

  it("calls the retreat callback when retreat timer reaches zero", () => {
    const combat = {
      allies: {
        creatures: [],
        retreatTriggers: [],
        retreatTimer: 1,
      },
      enemies: undefined as unknown as CombatSide,
    };

    const handleRetreatCallback = vi.fn();

    handleRetreat(combat, handleRetreatCallback, {} as GameContext);

    expect(handleRetreatCallback).toHaveBeenCalled();
  });

  it("calls the retreat callback immediately if all allies are dead", () => {
    const combat: Combat = {
      allies: {
        creatures: [
          buildAdventurerInstance({
            id: "creature-1",
            definitionId: "human",
            name: "Fallen Creature",
            hp: 0,
          }),
        ],
        retreatTriggers: [],
        retreatTimer: -1,
      },
      enemies: undefined as unknown as CombatSide,
    };

    const handleRetreatCallback = vi.fn();

    handleRetreat(combat, handleRetreatCallback, {} as GameContext);

    expect(handleRetreatCallback).toHaveBeenCalled();
  });
});
