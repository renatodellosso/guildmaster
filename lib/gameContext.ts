import { BuildingInstance } from "./building";
import { BuildingId } from "./content/buildings";
import { AdventurerInstance, CreatureProvider } from "./creature";
import { Expedition } from "./expedition";
import { Inventory } from "./inventory";
import { Id, OptionalFunc } from "./utilTypes";

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

export type GameProviderSource = BuildingInstance;

export type GameProvider = CreatureProvider & {
  maxRosterSize?: OptionalFunc<
    number,
    [GameProvider, GameContext, GameProviderSource]
  >;
  maxPartySize?: OptionalFunc<
    number,
    [GameProvider, number, GameContext, GameProviderSource]
  >;
};
