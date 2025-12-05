import { ItemDefinition } from "../item";
import { finishRegistry, RawRegistry } from "../registry";
import { EquipmentId, rawEquipments } from "./equipments";

type RawItemId = "coin";
export type ItemId = RawItemId | EquipmentId;

const rawItems = {
  coin: {
    name: "Coin",
    description: "A shiny gold coin.",
    value: 1,
  },
} satisfies RawRegistry<RawItemId, ItemDefinition>;

const rawAllItems: RawRegistry<ItemId, ItemDefinition> = {
  ...rawItems,
  ...rawEquipments,
};

export const items = finishRegistry<ItemId, ItemDefinition>(rawAllItems);
