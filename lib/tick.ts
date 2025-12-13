import { ActivityInstance } from "./activity";
import { handleCombatTick } from "./combat";
import { activities } from "./content/activities";
import { BuildingId, buildings } from "./content/buildings";
import { AdventurerInstance, CreatureInstance } from "./creature";
import {
  getHealthRegen,
  getManaRegen,
  getProviders,
  heal,
  regenMana,
} from "./creatureUtils";
import { GameContext } from "./gameContext";
import { tickAllStatusEffects } from "./statusEffect";

export function tick(gameContext: GameContext) {
  healRoster(gameContext);

  const creaturesToTick: Set<CreatureInstance> = new Set();

  for (const creature of Object.values(gameContext.roster)) {
    creaturesToTick.add(creature);
  }

  for (const expedition of gameContext.expeditions) {
    handleCombatTick(expedition, gameContext);

    for (const creature of [
      ...expedition.combat.allies.creatures,
      ...expedition.combat.enemies.creatures,
    ]) {
      if (typeof creature === "object") {
        creaturesToTick.add(creature);
      }
    }
  }

  for (const creature of creaturesToTick) {
    tickCreature(creature, gameContext);
  }

  for (const [buildingId, instance] of Object.entries(gameContext.buildings)) {
    const buildingDef = buildings[buildingId as BuildingId];
    if (buildingDef.tickBuilding) {
      buildingDef.tickBuilding(instance.data, gameContext);
    }
  }
}

function healRoster(gameContext: GameContext) {
  for (const creature of Object.values(gameContext.roster)) {
    const activity = activities[creature.activity.definitionId];
    const regenMultiplier = activity.healthRegenMultiplier ?? 1;

    const regen = getHealthRegen(creature, gameContext) * regenMultiplier;
    heal(creature, regen, gameContext);
  }
}

function tickCreature(creature: CreatureInstance, gameContext: GameContext) {
  // Tick status effects
  tickAllStatusEffects(creature, gameContext);

  if ("activity" in creature) {
    const activityInstance = creature.activity as ActivityInstance;
    const activity = activities[activityInstance.definitionId];
    if (activity.tick) {
      activity.tick(creature as AdventurerInstance, gameContext);
    }
  }

  const providers = getProviders(creature, gameContext);
  for (const provider of providers) {
    provider.def.tick?.(
      {
        creature,
        source: provider.source,
      },
      gameContext
    );
  }

  regenMana(creature, getManaRegen(creature, gameContext), gameContext);

  fixPotentialErrors(creature);
}

function fixPotentialErrors(creature: CreatureInstance) {
  if (isNaN(creature.hp) || creature.hp < 0) {
    creature.hp = 0;
  }

  if (isNaN(creature.mana) || creature.mana < 0) {
    creature.mana = 0;
  }
}
