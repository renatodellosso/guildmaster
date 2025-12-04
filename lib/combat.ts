import { selectAbilityForCreature } from "./ability";
import { RetreatTriggerId, retreatTriggers } from "./content/retreatTriggers";
import { AdventurerInstance, CreatureInstance } from "./creature";
import { Expedition, startCombat } from "./expedition";
import { GameContext } from "./gameContext";
import { getCreature } from "./utils";
import { Id } from "./utilTypes";

export type RetreatTriggerDefinition = {
  shouldRetreat: (combat: Combat, data?: unknown) => boolean;
  /**
   * Not specified = true
   */
  canSelect?: boolean;
};

export type RetreatTriggerInstance<TDefId extends Id> = {
  id: Id;
  definitionId: TDefId;
  data?: unknown;
};

export type Combat = {
  allies: CombatSide;
  enemies: CombatSide;
};

export type CombatSide = {
  creatures: (CreatureInstance | Id)[];
  retreatTriggers: RetreatTriggerInstance<RetreatTriggerId>[];
  /**
   * -1 = not retreating
   */
  retreatTimer: number;
};

function takeTurnForCreature(
  creature: CreatureInstance,
  combat: Combat,
  gameContext: GameContext
) {
  if (creature.hp <= 0) {
    return;
  }

  const ability = selectAbilityForCreature(creature, combat, gameContext);

  if (!ability) {
    return;
  }

  const rawTargets = ability.selectTargets(creature, combat, gameContext);

  const targets = rawTargets.map((targetOrId) =>
    getCreature(targetOrId, gameContext)
  );

  ability.activate(creature, targets, combat, gameContext);
}

function isEntireSideDead(side: CombatSide, gameContext: GameContext): boolean {
  for (const creatureOrId of side.creatures) {
    const creature = getCreature(creatureOrId, gameContext);

    if (creature.hp > 0) {
      return false;
    }
  }

  return true;
}

export function checkRetreatTriggers(combat: Combat): boolean {
  for (const retreatTriggerInstance of combat.allies.retreatTriggers) {
    const retreatTriggerDef =
      retreatTriggers[retreatTriggerInstance.definitionId];

    if (retreatTriggerDef.shouldRetreat(combat, retreatTriggerInstance.data)) {
      return true;
    }
  }

  return false;
}

export function handleRetreat(
  combat: Combat,
  retreat: () => void,
  gameContext: GameContext
) {
  if (isEntireSideDead(combat.allies, gameContext)) {
    retreat();
    return;
  }

  if (combat.allies.retreatTimer === -1) {
    if (checkRetreatTriggers(combat)) {
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
function takeTurnsForCombatSide(
  combat: Combat,
  retreat: () => void,
  gameContext: GameContext
) {
  for (const creatureOrId of combat.allies.creatures) {
    const creature = getCreature(creatureOrId, gameContext);

    takeTurnForCreature(creature, combat, gameContext);
  }

  handleRetreat(combat, retreat, gameContext);
}

/**
 * Takes a full round of combat, with both sides taking their turns.
 */
export function takeCombatTurn(
  combat: Combat,
  onVictory: () => void,
  onDefeat: () => void,
  gameContext: GameContext
) {
  takeTurnsForCombatSide(combat, onDefeat, gameContext);

  let tmp = combat.allies;
  combat.allies = combat.enemies;
  combat.enemies = tmp;

  takeTurnsForCombatSide(combat, onVictory, gameContext);

  tmp = combat.allies;
  combat.allies = combat.enemies;
  combat.enemies = tmp;
}

export function handleCombatTick(
  expedition: Expedition,
  gameContext: GameContext
) {
  function onVictory() {
    console.log("Expedition victorious!");
    expedition.combat = startCombat(expedition, gameContext);
  }

  function onDefeat() {
    console.log("Expedition defeated!");
    gameContext.expeditions = gameContext.expeditions.filter(
      (c) => c.combat !== expedition.combat
    );

    for (const creatureOrId of expedition.combat.allies.creatures) {
      const creature = getCreature(
        creatureOrId,
        gameContext
      ) as AdventurerInstance;
      creature.activity = {
        definitionId: "resting",
      };
    }
  }

  takeCombatTurn(expedition.combat, onVictory, onDefeat, gameContext);
}

export function chooseRandomLivingTarget(
  side: CombatSide,
  gameContext: GameContext
): [CreatureInstance] | [] {
  const livingCreatures = side.creatures
    .filter((creatureOrId) => {
      const creature = getCreature(creatureOrId, gameContext);
      return creature.hp > 0;
    })
    .map((creatureOrId) => getCreature(creatureOrId, gameContext));

  if (livingCreatures.length === 0) {
    return [];
  }

  const randomIndex = Math.floor(Math.random() * livingCreatures.length);
  return [livingCreatures[randomIndex]];
}
