import { GameContext } from "../gameContext";
import { RegistryContext } from "../registry";
import { CreatureDefId, creatures } from "./creatures";

export const mainRegistry: RegistryContext<CreatureDefId, never> = {
  creatures,
  retreatTriggers: {},
};

export type MainRegistryContext = typeof mainRegistry;
export type MainGameContext = GameContext<MainRegistryContext>;
