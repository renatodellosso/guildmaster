import { creatures } from "./content/creatures";
import { CreatureInstance } from "./creature";
import { GameContext } from "./gameContext";
import { getFromOptionalFunc } from "./utilTypes";

export function getMaxHealth(
  creature: CreatureInstance,
  gameContext: GameContext
): number {
  return getFromOptionalFunc(
    creatures[creature.definitionId].maxHealth,
    creature,
    0,
    gameContext
  );
}

export function getHealthRegenWhileResting(
  creature: CreatureInstance,
  gameContext: GameContext
): number {
  let regen = 1;

  if (creatures[creature.definitionId].healthRegenWhileResting) {
    regen = getFromOptionalFunc(
      creatures[creature.definitionId].healthRegenWhileResting!,
      creature,
      regen,
      gameContext
    );
  }

  return regen;
}

export function heal(
  creature: CreatureInstance,
  amount: number,
  gameContext: GameContext
): void {
  creature.hp = Math.min(
    creature.hp + amount,
    getMaxHealth(creature, gameContext)
  );
}

export function takeDamage(creature: CreatureInstance, amount: number): void {
  creature.hp = Math.max(creature.hp - amount, 0);
}
