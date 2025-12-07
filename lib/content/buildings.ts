import { BuildingDefinition, buildingFilter } from "../building";
import { DamageType } from "../damage";
import { finishRegistry, RawRegistry } from "../registry";

export type BuildingId =
  | "firepit"
  | "bonfire"
  | "longhall"
  | "tents"
  | "huts"
  | "barracks"
  | "dormitories"
  | "altar"
  | "temple"
  | "profane_shrine"
  | "radiant_shrine"
  | "war_room"
  | "staging_ground"
  | "medical_tent"
  | "medical_hut"
  | "infirmary"
  | "workshop";

export type BuildingTag =
  | "guildCenter"
  | "temple"
  | "housing"
  | "medical"
  | "workshop";

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
  barracks: {
    name: "Barracks",
    description: "A barracks to train and house adventurers.",
    canBuild: buildingFilter({
      hasUpgradeOf: ["longhall"],
      hasBuildingIds: ["huts"],
    }),
    tags: ["housing"],
    replaces: "huts",
    cost: [{ definitionId: "coin", amount: 3500 }],
    buildTime: 10000,
    maxRosterSize: 7,
    maxPartySize: 2,
    maxHealth: 20,
    healthRegen: 1,
  },
  dormitories: {
    name: "Dormitories",
    description: "Spacious dormitories to house and train more adventurers.",
    canBuild: buildingFilter({
      hasBuildingIds: ["barracks"],
    }),
    tags: ["housing"],
    replaces: "barracks",
    cost: [
      { definitionId: "coin", amount: 35000 },
      { definitionId: "cloth", amount: 100 },
    ],
    buildTime: 600000,
    maxRosterSize: 12,
    maxPartySize: 2,
    maxHealth: 35,
    healthRegen: 2,
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
  temple: {
    name: "Temple",
    description: "A temple for worship, rituals, and divine blessings.",
    canBuild: true,
    replaces: "altar",
    tags: ["temple"],
    cost: [
      { definitionId: "coin", amount: 2000 },
      {
        definitionId: "vampiric_dust",
        amount: 5,
      },
      {
        definitionId: "longsword",
        amount: 1,
      },
    ],
    buildTime: 8000,
    manaRegen: 2,
    healthRegen: 2,
  },
  profane_shrine: {
    name: "Profane Shrine",
    description: "A dark shrine that channels unholy energies.",
    canBuild: buildingFilter({
      hasBuildingIds: ["temple"],
    }),
    tags: ["temple"],
    cost: [
      { definitionId: "coin", amount: 3000 },
      {
        definitionId: "vampiric_dust",
        amount: 10,
      },
    ],
    buildTime: 60000,
    manaRegen: 3,
    healthRegen: 1,
    resistances: {
      [DamageType.Necrotic]: 0.1,
      [DamageType.Cold]: 0.1,
      [DamageType.Radiant]: -0.1,
      [DamageType.Fire]: -0.1,
    },
  },
  radiant_shrine: {
    name: "Radiant Shrine",
    description: "A holy shrine that radiates divine energy.",
    canBuild: buildingFilter({
      hasBuildingIds: ["temple"],
    }),
    tags: ["temple"],
    cost: [
      { definitionId: "coin", amount: 3000 },
      {
        definitionId: "incense",
        amount: 10,
      },
    ],
    buildTime: 60000,
    manaRegen: 3,
    healthRegen: 1,
    resistances: {
      [DamageType.Radiant]: 0.1,
      [DamageType.Fire]: 0.1,
      [DamageType.Necrotic]: -0.1,
      [DamageType.Cold]: -0.1,
    },
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
    xpMultiplier: 0.1,
  },
  staging_ground: {
    name: "Staging Ground",
    description:
      "A field for adventurers to prepare and stage before expeditions.",
    canBuild: buildingFilter({
      hasBuildingIds: ["war_room"],
    }),
    tags: [],
    cost: [{ definitionId: "coin", amount: 2000 }],
    buildTime: 36000,
    maxExpeditions: 1,
    maxPartySize: 1,
  },
  medical_tent: {
    name: "Medical Tent",
    description: "A tent equipped to heal and care for injured adventurers.",
    canBuild: buildingFilter({
      hasBuildingTags: ["guildCenter"],
    }),
    tags: ["medical"],
    cost: [
      { definitionId: "coin", amount: 800 },
      {
        definitionId: "tattered_cloth",
        amount: 10,
      },
    ],
    buildTime: 3600,
    healthRegen: 3,
  },
  medical_hut: {
    name: "Medical Hut",
    description:
      "A hut equipped with advanced medical supplies to heal adventurers.",
    canBuild: buildingFilter({
      hasBuildingIds: ["medical_tent"],
    }),
    tags: ["medical"],
    cost: [
      { definitionId: "coin", amount: 3000 },
      {
        definitionId: "tattered_cloth",
        amount: 25,
      },
      {
        definitionId: "slime",
        amount: 50,
      },
    ],
    buildTime: 14400,
    replaces: "medical_tent",
    healthRegen: 6,
    maxHealth: 20,
  },
  infirmary: {
    name: "Infirmary",
    description:
      "A fully equipped infirmary to provide top-notch medical care to adventurers.",
    canBuild: buildingFilter({
      hasBuildingIds: ["medical_hut"],
    }),
    tags: ["medical"],
    cost: [
      { definitionId: "coin", amount: 10000 },
      {
        definitionId: "tattered_cloth",
        amount: 50,
      },
      {
        definitionId: "slime",
        amount: 100,
      },
      {
        definitionId: "incense",
        amount: 5,
      },
    ],
    buildTime: 72000,
    replaces: "medical_hut",
    healthRegen: 10,
    maxHealth: 50,
    manaRegen: 2,
  },
  workshop: {
    name: "Workshop",
    description: "A place for crafting and repairing equipment.",
    canBuild: buildingFilter({
      hasBuildingTags: ["guildCenter"],
    }),
    tags: ["workshop"],
    cost: [{ definitionId: "coin", amount: 1500 }],
    buildTime: 144000,
    constructionPerTick: 1,
  },
} satisfies RawRegistry<BuildingId, BuildingDefinition>;

export const buildings = finishRegistry<BuildingId, BuildingDefinition>(
  rawBuildings
);
