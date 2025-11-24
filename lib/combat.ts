import { selectAbilityForCreature } from "./ability";
import { CreatureInstance } from "./creature";
import {
  RegistryContext,
  RegistryToCreatureDefId,
  RegistryToRetreatTriggerId,
} from "./registry";
import { Id } from "./utilTypes";

export type RetreatTriggerDefinition<TRegistryContext extends RegistryContext> =
  (
    combat: Combat<TRegistryContext>,
    registryContext: TRegistryContext,
    data?: unknown
  ) => boolean;

export type RetreatTriggerInstance<TDefId extends Id> = {
  id: Id;
  definitionId: TDefId;
  data?: unknown;
};

export type Combat<TRegistryContext extends RegistryContext> = {
  allies: CombatSide<TRegistryContext>;
  enemies: CombatSide<TRegistryContext>;
};

export type CombatSide<TRegistryContext extends RegistryContext> = {
  creatures: CreatureInstance<RegistryToCreatureDefId<TRegistryContext>>[];
  retreatTriggers: RetreatTriggerInstance<
    RegistryToRetreatTriggerId<TRegistryContext>
  >[];
  /**
   * -1 = not retreating
   */
  retreatTimer: number;
};

function takeTurnForCreature<TRegistryContext extends RegistryContext>(
  creature: CreatureInstance<RegistryToCreatureDefId<TRegistryContext>>,
  combat: Combat<TRegistryContext>,
  registryContext: TRegistryContext
) {
  const ability = selectAbilityForCreature(creature, combat, registryContext);

  if (!ability) {
    return;
  }

  ability.activate(
    creature,
    ability.selectTargets(creature, combat, registryContext),
    combat,
    registryContext
  );
}

export function checkRetreatTriggers<TRegistryContext extends RegistryContext>(
  combat: Combat<TRegistryContext>,
  registryContext: TRegistryContext
): boolean {
  for (const retreatTriggerInstance of combat.allies.retreatTriggers) {
    const retreatTriggerDef =
      registryContext.retreatTriggers[retreatTriggerInstance.definitionId];

    if (
      retreatTriggerDef(combat, registryContext, retreatTriggerInstance.data)
    ) {
      return true;
    }
  }

  return false;
}

export function handleRetreat<TRegistryContext extends RegistryContext>(
  combat: Combat<TRegistryContext>,
  retreat: () => void,
  registryContext: TRegistryContext
) {
  if (combat.allies.retreatTimer === -1) {
    if (checkRetreatTriggers(combat, registryContext)) {
      combat.allies.retreatTimer = 3; // Retreat in 3 turns
    }
    return;
  }

  combat.allies.retreatTimer--;

  if (combat.allies.retreatTimer === 0) {
    retreat();
  }
}

/**
 * Takes turns for all creatures on the ally side of the combat.
 */
function takeTurnsForCombatSide<TRegistryContext extends RegistryContext>(
  combat: Combat<TRegistryContext>,
  retreat: () => void,
  registryContext: TRegistryContext
) {
  for (const creature of combat.allies.creatures) {
    takeTurnForCreature(creature, combat, registryContext);
  }

  handleRetreat(combat, retreat, registryContext);
}

/**
 * Takes a full round of combat, with both sides taking their turns.
 */
export function takeCombatTurn<TRegistryContext extends RegistryContext>(
  combat: Combat<TRegistryContext>,
  retreat: () => void,
  registryContext: TRegistryContext
) {
  takeTurnsForCombatSide(combat, retreat, registryContext);

  let tmp = combat.allies;
  combat.allies = combat.enemies;
  combat.enemies = tmp;

  takeTurnsForCombatSide(combat, retreat, registryContext);

  tmp = combat.allies;
  combat.allies = combat.enemies;
  combat.enemies = tmp;
}
