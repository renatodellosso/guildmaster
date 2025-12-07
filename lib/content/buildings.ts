import { BuildingDefinition, buildingFilter } from "../building";
import { finishRegistry, RawRegistry } from "../registry";

export type BuildingId =
  | "firepit"
  | "bonfire"
  | "longhall"
  | "tents"
  | "huts"
  | "altar"
  | "war_room";
export type BuildingTag = "guildCenter" | "temple" | "housing";

const rawBuildings = {
  firepit: {
    name: "Firepit",
    description: "A simple firepit to keep adventurers warm and cook food.",
    canBuild: buildingFilter({
      lacksBuildingTags: ["guildCenter"],
    }),
    tags: ["guildCenter"],
    cost: [{ definitionId: "coin", amount: 30 }],
    buildTime: 60,
    healthRegen: 1,
    maxRosterSize: 1,
  },
  bonfire: {
    name: "Bonfire",
    description:
      "A large bonfire to keep adventurers warm and cook food for a larger group.",
    canBuild: buildingFilter({
      hasBuildingIds: ["firepit"],
    }),
    tags: ["guildCenter"],
    cost: [{ definitionId: "coin", amount: 200 }],
    buildTime: 300,
    replaces: "firepit",
    healthRegen: 1,
    maxPartySize: 1,
    maxRosterSize: 1,
  },
  longhall: {
    name: "Longhall",
    description: "A spacious hall for adventurers to gather, eat, and rest.",
    canBuild: buildingFilter({
      hasBuildingIds: ["bonfire"],
      lacksBuildingTags: ["housing"],
    }),
    tags: ["guildCenter"],
    cost: [{ definitionId: "coin", amount: 1000 }],
    buildTime: 4000,
    replaces: "bonfire",
    healthRegen: 2,
    maxPartySize: 2,
    maxRosterSize: 2,
    maxHealth: 10,
  },
  tents: {
    name: "Tents",
    description: "Tents to provide shelter for adventurers.",
    canBuild: true,
    tags: [],
    cost: [{ definitionId: "coin", amount: 100 }],
    buildTime: 600,
    maxRosterSize: 2,
  },
  huts: {
    name: "Huts",
    description: "Small huts to provide better shelter for adventurers.",
    canBuild: buildingFilter({
      hasUpgradeOf: ["bonfire"],
      hasBuildingIds: ["tents"],
    }),
    replaces: "tents",
    tags: ["housing"],
    cost: [
      { definitionId: "coin", amount: 500 },
      {
        definitionId: "tattered_cloth",
        amount: 5,
      },
    ],
    buildTime: 2400,
    maxRosterSize: 4,
  },
  altar: {
    name: "Altar",
    description: "A sacred altar for worship and rituals.",
    canBuild: buildingFilter({
      hasBuildingTags: ["guildCenter"],
      lacksBuildingTags: ["temple"],
    }),
    tags: ["temple"],
    cost: [
      { definitionId: "rat_tail", amount: 15 },
      {
        definitionId: "slime",
        amount: 10,
      },
      {
        definitionId: "coin",
        amount: 250,
      },
      {
        definitionId: "rat_tooth_necklace",
        amount: 1,
      },
      {
        definitionId: "shield_bauble",
        amount: 1,
      },
    ],
    buildTime: 1200,
    manaRegen: 1,
    healthRegen: 1,
  },
  war_room: {
    name: "War Room",
    description:
      "A strategic room for planning battles and training adventurers.",
    canBuild: buildingFilter({
      hasBuildingTags: ["guildCenter"],
    }),
    tags: [],
    cost: [
      { definitionId: "coin", amount: 500 },
      {
        definitionId: "longsword",
        amount: 1,
      },
      {
        definitionId: "tattered_cloth",
        amount: 5,
      },
    ],
    buildTime: 1800,
    maxExpeditions: 1,
  },
} satisfies RawRegistry<BuildingId, BuildingDefinition>;

export const buildings = finishRegistry<BuildingId, BuildingDefinition>(
  rawBuildings
);
