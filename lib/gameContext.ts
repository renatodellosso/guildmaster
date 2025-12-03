import { AdventurerInstance } from "./creature";
import { Expedition } from "./expedition";
import { Id } from "./utilTypes";

export type GameContext = {
  lastTick: number;

  roster: {
    [id: Id]: AdventurerInstance;
  };
  expeditions: Expedition[];
};
