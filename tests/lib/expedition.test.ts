import { Expedition, startCombat } from "@/lib/expedition";
import { describe, expect, it } from "vitest";
import { Table } from "@/lib/table";
import { Encounter } from "@/lib/dungeon";
import { CreatureInstance } from "@/lib/creature";
import { Id } from "@/lib/utilTypes";
import { Combat } from "@/lib/combat";
import { dungeons } from "@/lib/content/dungeons";
import { GameContext } from "@/lib/gameContext";

describe(startCombat.name, () => {
  it("chooses a random encounter", () => {
    const expedition: Expedition = {
      dungeonId: "bandit_camp",
      party: ["hero1", "hero2"],
      combat: {} as Combat,
      inventory: [],
      log: [],
      turnNumber: 0,
    };

    const enemyIds = new Set<Id>();

    const iterations = 100;
    for (let i = 0; i < iterations; i++) {
      const combatInstance = startCombat(
        expedition,
        {} as unknown as GameContext
      );
      combatInstance.enemies.creatures.forEach(
        (creature: Id | CreatureInstance) => {
          enemyIds.add((creature as CreatureInstance).definitionId);
        }
      );
    }

    const possibleEnemyIds = new Set<Id>();
    dungeons[expedition.dungeonId].encounters.items.forEach((encounter) => {
      encounter.item.forEach((entry) => {
        possibleEnemyIds.add(entry.id);
      });
    });

    expect(enemyIds.size).toBe(possibleEnemyIds.size);
  });

  it("creates the correct number of enemies", () => {
    const expedition: Expedition = {
      dungeonId: "bandit_camp",
      party: ["hero1", "hero2"],
      combat: {} as Combat,
      inventory: [],
      log: [],
      turnNumber: 0,
    };

    dungeons[expedition.dungeonId].encounters = new Table<Encounter>([
      {
        item: [
          {
            id: "human",
            count: 5,
          },
          {
            id: "goblin",
            count: 2,
          },
        ],
        weight: 1,
      },
    ]);

    const combatInstance = startCombat(
      expedition,
      {} as unknown as GameContext
    );

    const creatureCount: Record<Id, number> = {};
    combatInstance.enemies.creatures.forEach(
      (creature: Id | CreatureInstance) => {
        const definitionId = (creature as CreatureInstance).definitionId;
        creatureCount[definitionId] = (creatureCount[definitionId] || 0) + 1;
      }
    );

    expect(creatureCount["human"]).toBe(5);
    expect(creatureCount["goblin"]).toBe(2);
  });
});
