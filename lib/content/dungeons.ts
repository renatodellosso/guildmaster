import { DungeonDefinition, Encounter } from "../dungeon";
import { finishRegistry, RawRegistry } from "../registry";
import { Table } from "../table";
import { MainRegistryContext } from "./mainRegistryContext";

export type DungeonId = "bandit_camp";

export const rawDungeons = {
  bandit_camp: {
    name: "Bandit Camp",
    encounters: new Table<Encounter<MainRegistryContext>>([
      {
        item: [
          {
            id: "human",
            count: 3,
          },
        ],
        weight: 1,
      },
    ]),
  },
} satisfies RawRegistry<DungeonId, DungeonDefinition<MainRegistryContext>>;

export const dungeons = finishRegistry<
  DungeonId,
  DungeonDefinition<MainRegistryContext>
>(rawDungeons);
