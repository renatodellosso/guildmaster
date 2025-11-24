import {
  checkRetreatTriggers,
  Combat,
  CombatSide,
  handleRetreat,
  takeCombatTurn,
} from "@/lib/combat";
import { RegistryContext, RegistryToCreatureDefId } from "@/lib/registry";
import { getFromOptionalFunc, Id } from "@/lib/utilTypes";
import { describe, expect, it, vi } from "vitest";
import { buildRegistryContext } from "../testUtils";
import { CreatureInstance } from "@/lib/creature";

function failTest() {
  throw new Error("This function should not have been called");
}

function buildCombatSide<TRegistryContext extends RegistryContext>(
  creatureInstances: CreatureInstance<
    RegistryToCreatureDefId<TRegistryContext>
  >[]
): CombatSide<TRegistryContext> {
  return {
    creatures: creatureInstances,
    retreatTriggers: [],
    retreatTimer: -1,
  };
}

describe(takeCombatTurn.name, () => {
  it("takes a turn for each creature", () => {
    const registryContext = buildRegistryContext({
      creatures: {
        "creature-1": {
          id: "creature-1",
          name: "Creature 1",
          skills: {},
          abilities: [
            {
              name: "No Op",
              description: "Does nothing",
              activate: vi.fn(),
              selectTargets: () => [],
              canActivate: true,
              priority: 0,
            },
          ],
        },
        "creature-2": {
          id: "creature-2",
          name: "Creature 2",
          skills: {},
          abilities: [
            {
              name: "No Op",
              description: "Does nothing",
              activate: vi.fn(),
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
        { id: "instance-1", definitionId: "creature-1", hp: 10 },
        {
          id: "instance-2",
          definitionId: "creature-1",
          hp: 10,
        },
      ]),
      enemies: buildCombatSide([
        { id: "instance-3", definitionId: "creature-2", hp: 10 },
        {
          id: "instance-4",
          definitionId: "creature-2",
          hp: 10,
        },
      ]),
    } satisfies Combat<typeof registryContext>;

    takeCombatTurn(combat, failTest, registryContext);

    for (const creature of [
      ...combat.allies.creatures,
      ...combat.enemies.creatures,
    ]) {
      const creatureDef = registryContext.creatures[creature.definitionId];
      const abilities = getFromOptionalFunc(
        creatureDef.abilities,
        creature,
        combat,
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
                combat: Combat<RegistryContext>,
                _registryContext: unknown
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
        { id: "instance-1", definitionId: "creature-1", hp: 10 },
      ]),
      enemies: buildCombatSide([
        { id: "instance-2", definitionId: "creature-1", hp: 10 },
      ]),
    } satisfies Combat<typeof registryContext>;

    takeCombatTurn(combat, failTest, registryContext);
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
              activate: (
                caster: { id: Id },
                _targets: unknown,
                _combat: unknown,
                _registryContext: unknown
              ) => {
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
        { id: "instance-1", definitionId: "creature-1", hp: 10 },
        { id: "instance-2", definitionId: "creature-1", hp: 10 },
      ]),
      enemies: buildCombatSide([
        { id: "instance-3", definitionId: "creature-1", hp: 10 },
        { id: "instance-4", definitionId: "creature-1", hp: 10 },
      ]),
    } satisfies Combat<typeof registryContext>;

    takeCombatTurn(combat, failTest, registryContext);

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
        "retreat-trigger-1": (
          _combat: unknown,
          _registryContext: unknown,
          _data: unknown
        ) => {
          return false;
        },
        "retreat-trigger-2": (
          _combat: unknown,
          _registryContext: unknown,
          _data: unknown
        ) => {
          return true;
        },
      },
    });

    const combat = {
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
      enemies: undefined as any,
    } satisfies Combat<typeof registryContext>;

    const result = checkRetreatTriggers(combat, registryContext);

    expect(result).toBe(true);
  });
});

describe(handleRetreat.name, () => {
  it("sets retreat timer when a retreat trigger is activated", () => {
    const registryContext = buildRegistryContext({
      retreatTriggers: {
        "retreat-trigger-1": (
          _combat: unknown,
          _registryContext: unknown,
          _data: unknown
        ) => {
          return false;
        },
        "retreat-trigger-2": (
          _combat: unknown,
          _registryContext: unknown,
          _data: unknown
        ) => {
          return true;
        },
      },
    });

    const combat = {
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
      enemies: undefined as any,
    } satisfies Combat<typeof registryContext>;

    handleRetreat(combat, () => {}, registryContext);

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
      enemies: undefined as any,
    } satisfies Combat<typeof registryContext>;

    const handleRetreatCallback = vi.fn();

    handleRetreat(combat, handleRetreatCallback, registryContext);

    expect(handleRetreatCallback).toHaveBeenCalled();
  });
});
