import { ItemDefinition } from "../item";
import { finishRegistry, RawRegistry } from "../registry";
import { EquipmentId, rawEquipments } from "./equipments";

type RawItemId = "coin" | "rat_tail" | "slime";
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
} satisfies RawRegistry<RawItemId, ItemDefinition>;

const rawAllItems: RawRegistry<ItemId, ItemDefinition> = {
  ...rawItems,
  ...rawEquipments,
};

export const items = finishRegistry<ItemId, ItemDefinition>(rawAllItems);
