import { DungeonDefinition, Encounter } from "../dungeon";
import { finishRegistry, RawRegistry } from "../registry";
import { Table } from "../table";

export type DungeonId = "bandit_camp" | "caves" | "sewers" | "crypts";

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
  caves: {
    name: "Caves",
    encounters: new Table<Encounter>([
      {
        item: [
          {
            id: "rat",
            count: 4,
          },
        ],
        weight: 1,
      },
      {
        item: [
          {
            id: "cave_crawler",
            count: 3,
          },
        ],
        weight: 1,
      },
      {
        item: [
          {
            id: "rat",
            count: 2,
          },
          {
            id: "cave_crawler",
            count: 2,
          },
        ],
        weight: 1,
      },
      {
        item: [
          {
            id: "rat_king",
            count: 1,
          },
          {
            id: "rat",
            count: 2,
          },
        ],
        weight: 1,
      },
    ]),
  },
  sewers: {
    name: "Sewers",
    encounters: new Table<Encounter>([
      {
        item: [
          {
            id: "plague_rat",
            count: 4,
          },
        ],
        weight: 1,
      },
      {
        item: [
          {
            id: "slime_tendril",
            count: 2,
          },
        ],
        weight: 1,
      },
      {
        item: [
          {
            id: "plague_rat",
            count: 2,
          },
          {
            id: "slime_tendril",
            count: 1,
          },
        ],
        weight: 1,
      },
      {
        item: [
          {
            id: "green_ooze",
            count: 1,
          },
          {
            id: "slime_tendril",
            count: 2,
          },
        ],
        weight: 1,
      },
    ]),
  },
  crypts: {
    name: "Crypts",
    encounters: new Table<Encounter>([
      {
        item: [
          {
            id: "vampire_thrall",
            count: 3,
          },
        ],
        weight: 1,
      },
      {
        item: [
          {
            id: "vampire_spawn",
            count: 2,
          },
        ],
        weight: 1,
      },
      {
        item: [
          {
            id: "vampire_thrall",
            count: 1,
          },
          {
            id: "vampire_spawn",
            count: 1,
          },
        ],
        weight: 1,
      },
      {
        item: [
          { id: "vampire_thrall", count: 5 },
          {
            id: "vampire_spawn",
            count: 2,
          },
          {
            id: "vampire",
            count: 1,
          },
        ],
        weight: 0.3,
      },
    ]),
  },
} satisfies RawRegistry<DungeonId, DungeonDefinition>;

export const dungeons = finishRegistry<DungeonId, DungeonDefinition>(
  rawDungeons
);
