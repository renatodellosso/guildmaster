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
    ]),
  },
} satisfies RawRegistry<DungeonId, DungeonDefinition>;

export const dungeons = finishRegistry<DungeonId, DungeonDefinition>(
  rawDungeons
);
