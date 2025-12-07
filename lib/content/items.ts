import { ItemDefinition } from "../item";
import { finishRegistry, RawRegistry } from "../registry";
import { EquipmentId, rawEquipments } from "./equipments";

type RawItemId =
  | "coin"
  | "rat_tail"
  | "slime"
  | "tattered_cloth"
  | "vampiric_dust"
  | "incense"
  | "cloth";

export type ItemId = RawItemId | EquipmentId;

const rawItems = {
  coin: {
    name: "Coin",
    description: "A shiny gold coin.",
    value: 1,
  },
  rat_tail: {
    name: "Rat Tail",
    description: "The tail of a rat, often used as a crafting material.",
    value: 2,
  },
  slime: {
    name: "Slime",
    description: "A blob of gelatinous slime.",
    value: 3,
  },
  tattered_cloth: {
    name: "Tattered Cloth",
    description: "A piece of old, tattered cloth.",
    value: 4,
  },
  vampiric_dust: {
    name: "Vampiric Dust",
    description:
      "Dust left behind by a vampire, rumored to have dark properties.",
    value: 25,
  },
  incense: {
    name: "Incense",
    description: "A stick of fragrant incense, used in rituals.",
    value: 10,
  },
  cloth: {
    name: "Cloth",
    description: "A piece of fine cloth, useful for crafting.",
    value: 8,
  },
} satisfies RawRegistry<RawItemId, ItemDefinition>;

const rawAllItems: RawRegistry<ItemId, ItemDefinition> = {
  ...rawItems,
  ...rawEquipments,
};

export const items = finishRegistry<ItemId, ItemDefinition>(rawAllItems);
