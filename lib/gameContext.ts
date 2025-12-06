import { BuildingInstance } from "./building";
import { BuildingId } from "./content/buildings";
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
  buildings: {
    [id in BuildingId]?: BuildingInstance;
  };
  /**
   * Maps ID to time remaining
   */
  buildingsUnderConstruction: {
    [id in BuildingId]?: number;
  };
};
