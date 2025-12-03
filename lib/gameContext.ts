import { CreatureInstance } from "./creature";
import { Expedition } from "./expedition";
import { RegistryContext } from "./registry";
import { Id } from "./utilTypes";

export type GameContext<TRegistryContext extends RegistryContext> = {
  lastTick: number;

  roster: {
    [id: Id]: CreatureInstance<TRegistryContext>;
  };
  expeditions: Expedition<TRegistryContext>[];
};
