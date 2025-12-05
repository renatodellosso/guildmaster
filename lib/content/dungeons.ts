import { DungeonDefinition, Encounter } from "../dungeon";
import { finishRegistry, RawRegistry } from "../registry";
import { Table } from "../table";

export type DungeonId = "bandit_camp";

export const rawDungeons = {
  bandit_camp: {
    name: "Bandit Camp",
    encounters: new Table<Encounter>([
      {
        item: [
          {
            id: "goblin",
            count: 3,
          },
        ],
        weight: 1,
      },
      {
        item: [
          {
            id: "bandit",
            count: 2,
          },
        ],
        weight: 1,
      },
      {
        item: [
          {
            id: "goblin",
            count: 1,
          },
          {
            id: "bandit",
            count: 1,
          },
        ],
        weight: 1,
      },
      {
        item: [
          {
            id: "bandit_archer",
            count: 2,
          },
        ],
        weight: 1,
      },
      {
        item: [
          {
            id: "bandit_archer",
            count: 3,
          },
        ],
        weight: 1,
      },
      {
        item: [
          {
            id: "bandit",
            count: 1,
          },
          {
            id: "bandit_archer",
            count: 1,
          },
        ],
        weight: 1,
      },
    ]),
  },
} satisfies RawRegistry<DungeonId, DungeonDefinition>;

export const dungeons = finishRegistry<DungeonId, DungeonDefinition>(
  rawDungeons
);
