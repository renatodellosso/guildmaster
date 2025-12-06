import { BuildingDefinition, doesNotHaveBuildingTag } from "../building";
import { finishRegistry, RawRegistry } from "../registry";

export type BuildingId = "firepit" | "bonfire" | "tents";
export type BuildingTag = "guildCenter";

const rawBuildings = {
  firepit: {
    name: "Firepit",
    description: "A simple firepit to keep adventurers warm and cook food.",
    canBuild: doesNotHaveBuildingTag("guildCenter"),
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
    canBuild: doesNotHaveBuildingTag("guildCenter"),
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
} satisfies RawRegistry<BuildingId, BuildingDefinition>;

export const buildings = finishRegistry<BuildingId, BuildingDefinition>(
  rawBuildings
);
