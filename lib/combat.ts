import { selectAbilityForCreature } from "./ability";
import { RetreatTriggerId, retreatTriggers } from "./content/retreatTriggers";
import { AdventurerInstance, CreatureInstance } from "./creature";
import { Expedition, startCombat } from "./expedition";
import { GameContext } from "./gameContext";
import { addToInventory } from "./inventory";
import { getCreature, randRange } from "./utils";
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
  expedition: Expedition,
  gameContext: GameContext
) {
  if (creature.hp <= 0) {
    return;
  }

  const ability = selectAbilityForCreature(creature, expedition, gameContext);

  if (!ability) {
    return;
  }

  const rawTargets = ability.ability.selectTargets(
    creature,
    expedition,
    gameContext,
    ability.source
  );

  const targets = rawTargets.map((targetOrId) =>
    getCreature(targetOrId, gameContext)
  );

  ability.ability.activate(creature, targets, expedition, gameContext);
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
  expedition: Expedition,
  retreat: () => void,
  gameContext: GameContext
) {
  for (const creatureOrId of expedition.combat.allies.creatures) {
    const creature = getCreature(creatureOrId, gameContext);

    takeTurnForCreature(creature, expedition, gameContext);
  }

  handleRetreat(expedition.combat, retreat, gameContext);
}

/**
 * Takes a full round of combat, with both sides taking their turns.
 */
export function takeCombatTurn(
  expedition: Expedition,
  onVictory: () => void,
  onDefeat: () => void,
  gameContext: GameContext
) {
  const combat = expedition.combat;
  takeTurnsForCombatSide(expedition, onDefeat, gameContext);

  let tmp = combat.allies;
  combat.allies = combat.enemies;
  combat.enemies = tmp;

  takeTurnsForCombatSide(expedition, onVictory, gameContext);

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

    addToInventory(gameContext.inventory, expedition.inventory);
    expedition.inventory = [];

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

  takeCombatTurn(expedition, onVictory, onDefeat, gameContext);

  expedition.turnNumber++;
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

export function chooseRandomLivingTargetWithinRange(
  side: CombatSide,
  gameContext: GameContext,
  maxRange: number
): [CreatureInstance] | [] {
  const livingCreatures = side.creatures
    .filter((creatureOrId) => {
      const creature = getCreature(creatureOrId, gameContext);
      return creature.hp > 0;
    })
    .slice(0, maxRange)
    .map((creatureOrId) => getCreature(creatureOrId, gameContext));

  if (livingCreatures.length === 0) {
    return [];
  }

  const randomIndex = Math.floor(Math.random() * livingCreatures.length);
  return [livingCreatures[randomIndex]];
}

export function chooseMultipleRandomLivingTargetsWithinRange(
  side: CombatSide,
  gameContext: GameContext,
  maxRange: number,
  targetCount: number
): CreatureInstance[] {
  const livingCreatures = side.creatures
    .filter((creatureOrId) => {
      const creature = getCreature(creatureOrId, gameContext);
      return creature.hp > 0;
    })
    .slice(0, maxRange)
    .map((creatureOrId) => getCreature(creatureOrId, gameContext));

  if (livingCreatures.length === 0) {
    return [];
  }

  const selectedTargets: CreatureInstance[] = [];
  const availableTargets = [...livingCreatures];

  for (let i = 0; i < targetCount; i++) {
    if (availableTargets.length === 0) {
      break;
    }
    const randomIndex = randRange([0, availableTargets.length - 1]);
    selectedTargets.push(availableTargets[randomIndex]);
    availableTargets.splice(randomIndex, 1); // Remove selected target to avoid duplicates
  }

  return selectedTargets;
}
