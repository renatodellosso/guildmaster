import { activities, ActivityId } from "./content/activities";
import { GameContext } from "./gameContext";
import { AdventurerInstance, CreatureInstance } from "./creature";
import { getFromOptionalFunc, OptionalFunc, Tickable } from "./utilTypes";

export type ActivityDefinition = Tickable<AdventurerInstance> & {
  id: ActivityId;
  description: OptionalFunc<string, [CreatureInstance, GameContext]>;
  /**
   * Defaults to 1 if not specified.
   */
  healthRegenMultiplier?: number;
  /**
   * Not specified defaults to true.
   */
  canReassign?: OptionalFunc<boolean, [CreatureInstance, GameContext]>;
};

export type ActivityInstance = {
  definitionId: ActivityId;
  data?: unknown;
};

export function canReassignAdventurer(
  adventurer: AdventurerInstance,
  gameContext: GameContext
): boolean {
  const activityDef = activities[adventurer.activity.definitionId];
  if (!activityDef) return true;
  if (activityDef.canReassign === undefined) return true;

  return getFromOptionalFunc(activityDef.canReassign, adventurer, gameContext);
}
