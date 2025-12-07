import { BuildingDefinition, buildingFilter } from "../building";
import { finishRegistry, RawRegistry } from "../registry";

export type BuildingId = "firepit" | "bonfire" | "tents" | "altar";
export type BuildingTag = "guildCenter" | "temple";

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
  tents: {
    name: "Tents",
    description: "Tents to provide shelter for adventurers.",
    canBuild: true,
    tags: [],
    cost: [{ definitionId: "coin", amount: 100 }],
    buildTime: 600,
    maxRosterSize: 2,
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
} satisfies RawRegistry<BuildingId, BuildingDefinition>;

export const buildings = finishRegistry<BuildingId, BuildingDefinition>(
  rawBuildings
);
