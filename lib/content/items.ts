import { ItemDefinition } from "../item";
import { finishRegistry, RawRegistry } from "../registry";

export type ItemId = "coin";

const rawItems = {
  coin: {
    name: "Coin",
    description: "A shiny gold coin.",
    value: 1,
  },
} satisfies RawRegistry<ItemId, ItemDefinition>;

export const items = finishRegistry<ItemId, ItemDefinition>(rawItems);
