import { StatusEffectId, statusEffects } from "./content/statusEffects";
import { CreatureInstance, CreatureProvider } from "./creature";
import { GameContext } from "./gameContext";
import { OptionalFunc } from "./utilTypes";

export type StatusEffectDefinition = CreatureProvider & {
  id: StatusEffectId;
  name: string;
  description: OptionalFunc<
    string,
    [CreatureInstance | undefined, StatusEffectInstance, GameContext]
  >;
};

export type StatusEffectInstance = {
  definitionId: StatusEffectId;
  duration: number | "infinite";
  strength: number;
};

export function tickStatusEffect(
  instance: StatusEffectInstance,
  creature: CreatureInstance,
  gameContext: GameContext
): boolean {
  const statusEffectDef = statusEffects[instance.definitionId];
  if (statusEffectDef.tick) {
    statusEffectDef.tick({ creature, source: instance }, gameContext);
  }

  if (instance.duration !== "infinite") {
    instance.duration -= 1;
    return instance.duration <= 0;
  }
  return false;
}

export function tickAllStatusEffects(
  creature: CreatureInstance,
  gameContext: GameContext
) {
  if (!creature.statusEffects) {
    return;
  }

  creature.statusEffects = creature.statusEffects.filter((instance) => {
    const isExpired = tickStatusEffect(instance, creature, gameContext);
    return !isExpired;
  });
}
