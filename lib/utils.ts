import { CreatureInstance } from "./creature";
import { GameContext } from "./gameContext";
import { RegistryContext } from "./registry";
import { Id } from "./utilTypes";

export function chooseRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function randomId(): Id {
  return Math.random().toString(36).substring(2, 10);
}

export function getCreature<
  TRegistryContext extends RegistryContext,
  TCreature extends CreatureInstance<TRegistryContext>,
>(creatureId: TCreature | Id, gameContext: GameContext<TRegistryContext>) {
  if (typeof creatureId === "string") {
    return gameContext.roster[creatureId];
  } else {
    return creatureId as TCreature;
  }
}
