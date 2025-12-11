import { BuildingInstance } from "./building";
import { BuildingId } from "./content/buildings";
import { AdventurerInstance, CreatureProvider } from "./creature";
import { Expedition } from "./expedition";
import { Inventory } from "./inventory";
import { ItemInstance } from "./item";
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

export type GameProviderArgsBase = {
  provider: GameProvider;
  gameContext: GameContext;
  source?: GameProviderSource;
};

export type GameProviderArgsNumber = GameProviderArgsBase & {
  prev: number;
};

export type GameProvider = CreatureProvider & {
  maxRosterSize?: OptionalFunc<number, [GameProviderArgsNumber]>;
  maxPartySize?: OptionalFunc<number, [GameProviderArgsNumber]>;
  maxExpeditions?: OptionalFunc<number, [GameProviderArgsNumber]>;
  recruitmentCost?: OptionalFunc<
    ItemInstance[],
    [GameProviderArgsBase & { prev: ItemInstance[] }]
  >;
  startingSkillChance?: OptionalFunc<number, [GameProviderArgsNumber]>;
  sellValueMultiplier?: OptionalFunc<number, [GameProviderArgsNumber]>;
};
