import { selectAbilityForCreature } from "./ability";
import { CreatureInstance } from "./creature";
import { GameContext } from "./gameContext";
import {
  RegistryContext,
  RegistryToCreatureId,
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
  creatures: (CreatureInstance<RegistryToCreatureId<TRegistryContext>> | Id)[];
  retreatTriggers: RetreatTriggerInstance<
    RegistryToRetreatTriggerId<TRegistryContext>
  >[];
  /**
   * -1 = not retreating
   */
  retreatTimer: number;
};

function takeTurnForCreature<TRegistryContext extends RegistryContext>(
  creature: CreatureInstance<RegistryToCreatureId<TRegistryContext>>,
  combat: Combat<TRegistryContext>,
  gameContext: GameContext<TRegistryContext>,
  registryContext: TRegistryContext
) {
  const ability = selectAbilityForCreature(
    creature,
    combat,
    gameContext,
    registryContext
  );

  if (!ability) {
    return;
  }

  const rawTargets = ability.selectTargets(
    creature,
    combat,
    gameContext,
    registryContext
  );

  const targets = rawTargets.map((targetOrId) =>
    typeof targetOrId === "string"
      ? gameContext.roster[targetOrId]
      : (targetOrId as CreatureInstance<RegistryToCreatureId<TRegistryContext>>)
  );

  ability.activate(creature, targets, combat, gameContext, registryContext);
}

function isEntireSideDead<TRegistryContext extends RegistryContext>(
  side: CombatSide<TRegistryContext>,
  gameContext: GameContext<TRegistryContext>
): boolean {
  for (const creatureOrId of side.creatures) {
    const creature =
      typeof creatureOrId === "string"
        ? gameContext.roster[creatureOrId]
        : (creatureOrId as CreatureInstance<
            RegistryToCreatureId<TRegistryContext>
          >);

    if (creature.hp > 0) {
      return false;
    }
  }

  return true;
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
  gameContext: GameContext<TRegistryContext>,
  registryContext: TRegistryContext
) {
  if (isEntireSideDead(combat.allies, gameContext)) {
    retreat();
    return;
  }

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
  gameContext: GameContext<TRegistryContext>,
  registryContext: TRegistryContext
) {
  for (const creatureOrId of combat.allies.creatures) {
    // Lookup creature instance by ID
    const creature =
      typeof creatureOrId === "string"
        ? gameContext.roster[creatureOrId]
        : (creatureOrId as CreatureInstance<
            RegistryToCreatureId<TRegistryContext>
          >);

    takeTurnForCreature(creature, combat, gameContext, registryContext);
  }

  handleRetreat(combat, retreat, gameContext, registryContext);
}

/**
 * Takes a full round of combat, with both sides taking their turns.
 */
export function takeCombatTurn<TRegistryContext extends RegistryContext>(
  combat: Combat<TRegistryContext>,
  onVictory: () => void,
  onDefeat: () => void,
  gameContext: GameContext<TRegistryContext>,
  registryContext: TRegistryContext
) {
  takeTurnsForCombatSide(combat, onDefeat, gameContext, registryContext);

  let tmp = combat.allies;
  combat.allies = combat.enemies;
  combat.enemies = tmp;

  takeTurnsForCombatSide(combat, onVictory, gameContext, registryContext);

  tmp = combat.allies;
  combat.allies = combat.enemies;
  combat.enemies = tmp;
}

export function handleCombatTick<TRegistryContext extends RegistryContext>(
  combat: Combat<TRegistryContext>,
  gameContext: GameContext<TRegistryContext>,
  registryContext: TRegistryContext
) {
  function onVictory() {
    gameContext.expeditions = gameContext.expeditions.filter(
      (c) => c.combat !== combat
    );
  }

  function onDefeat() {
    gameContext.expeditions = gameContext.expeditions.filter(
      (c) => c.combat !== combat
    );
  }

  takeCombatTurn(combat, onVictory, onDefeat, gameContext, registryContext);
}
