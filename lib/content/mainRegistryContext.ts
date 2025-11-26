import { GameContext } from "../gameContext";
import { RegistryContext } from "../registry";
import { CreatureDefId, creatures } from "./creatures";
import { DungeonId, dungeons } from "./dungeons";

export const mainRegistry: RegistryContext<CreatureDefId, never, DungeonId> = {
  creatures,
  retreatTriggers: {},
  dungeons,
};

export type MainRegistryContext = typeof mainRegistry;
export type MainGameContext = GameContext<MainRegistryContext>;
