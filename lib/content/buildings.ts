import { BuildingDefinition } from "../building";
import { finishRegistry, RawRegistry } from "../registry";

export type BuildingId = "firepit" | "bonfire";

const rawBuildings = {
  firepit: {
    name: "Firepit",
    description: "A simple firepit to keep adventurers warm and cook food.",
    canBuild: true,
    cost: [{ definitionId: "coin", amount: 100 }],
    buildTime: 60,
  },
  bonfire: {
    name: "Bonfire",
    description:
      "A large bonfire to keep adventurers warm and cook food for a larger group.",
    canBuild: true,
    cost: [{ definitionId: "coin", amount: 500 }],
    buildTime: 300,
    replaces: "firepit",
  },
} satisfies RawRegistry<BuildingId, BuildingDefinition>;

export const buildings = finishRegistry<BuildingId, BuildingDefinition>(
  rawBuildings
);
