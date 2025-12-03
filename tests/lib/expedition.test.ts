import { startCombat } from "@/lib/expedition";
import { describe, expect, it } from "vitest";
import { buildRegistryContext } from "../testUtils";
import { Table } from "@/lib/table";
import { Encounter } from "@/lib/dungeon";
import { RegistryContext } from "@/lib/registry";
import { CreatureInstance } from "@/lib/creature";
import { Id } from "@/lib/utilTypes";
import { Combat } from "@/lib/combat";
import { MainRegistryContext } from "@/lib/content/mainRegistryContext";

describe(startCombat.name, () => {
  it("chooses a random encounter", () => {
    const registryContext = buildRegistryContext({
      dungeons: {
        dungeon1: {
          id: "dungeon1" as const,
          name: "Dungeon 1",
          encounters: new Table<Encounter<RegistryContext>>([
            {
              weight: 1,
              item: [{ id: "creature1", count: 2 }],
            },
            {
              weight: 2,
              item: [{ id: "creature2" as const, count: 3 }],
            },
          ]),
        },
      },
      creatures: {
        creature1: { id: "creature1", name: "Creature 1", skills: {} },
        creature2: { id: "creature2", name: "Creature 2", skills: {} },
      },
    });

    const expedition = {
      dungeonId: "dungeon1" as const,
      party: ["hero1", "hero2"],
      combat: {} as Combat<MainRegistryContext>,
    };

    const enemyIds = new Set<Id>();

    const iterations = 100;
    for (let i = 0; i < iterations; i++) {
      const combatInstance = startCombat(expedition, registryContext);
      combatInstance.enemies.creatures.forEach(
        (creature: Id | CreatureInstance<Id>) => {
          enemyIds.add((creature as CreatureInstance<Id>).definitionId);
        },
      );
    }

    expect(enemyIds.size).toBe(Object.keys(registryContext.creatures).length);
  });

  it("creates the correct number of enemies", () => {
    const registryContext = buildRegistryContext({
      dungeons: {
        dungeon1: {
          id: "dungeon1" as const,
          name: "Dungeon 1",
          encounters: new Table<Encounter<RegistryContext>>([
            {
              weight: 1,
              item: [
                { id: "creature1" as const, count: 2 },
                { id: "creature2" as const, count: 3 },
              ],
            },
          ]),
        },
      },
      creatures: {
        creature1: { id: "creature1", name: "Creature 1", skills: {} },
        creature2: { id: "creature2", name: "Creature 2", skills: {} },
      },
    });

    const expedition = {
      dungeonId: "dungeon1" as const,
      party: ["hero1", "hero2"],
      combat: {} as Combat<MainRegistryContext>,
    };

    const combatInstance = startCombat(expedition, registryContext);

    const creatureCount: Record<Id, number> = {};
    combatInstance.enemies.creatures.forEach(
      (creature: Id | CreatureInstance<Id>) => {
        const definitionId = (creature as CreatureInstance<Id>).definitionId;
        creatureCount[definitionId] = (creatureCount[definitionId] || 0) + 1;
      },
    );

    expect(creatureCount["creature1"]).toBe(2);
    expect(creatureCount["creature2"]).toBe(3);
  });
});
