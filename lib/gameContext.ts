import { AdventurerInstance } from "./creature";
import { Expedition } from "./expedition";
import { Inventory } from "./inventory";
import { Id } from "./utilTypes";

export type GameContext = {
  lastTick: number;
  roster: {
    [id: Id]: AdventurerInstance;
  };
  expeditions: Expedition[];
  inventory: Inventory;
};
