import { Combat } from "./combat";
import { creatures } from "./content/creatures";
import { CreatureInstance } from "./creature";
import { GameContext } from "./gameContext";
import { SkillId } from "./skills";
import { getCreature } from "./utils";
import { getFromOptionalFunc } from "./utilTypes";

export function getMaxHealth(
  creature: CreatureInstance,
  gameContext: GameContext
): number {
  let maxHp = getFromOptionalFunc(
    creatures[creature.definitionId].maxHealth,
    creature,
    0,
    gameContext
  );

  maxHp += 5 * getSkill(SkillId.Endurance, creature);

  return maxHp;
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

export function takeDamage(
  creature: CreatureInstance,
  amount: number,
  gameContext: GameContext,
  combat?: Combat
): void {
  const originalHp = creature.hp;

  creature.hp = Math.max(creature.hp - amount, 0);

  if (originalHp > 0 && creature.hp === 0) {
    onDie(creature, gameContext, combat);
  }
}

export function onDie(
  creature: CreatureInstance,
  gameContext: GameContext,
  combat?: Combat
): void {
  const def = creatures[creature.definitionId];
  const xpValue = def.xpValue
    ? getFromOptionalFunc(def.xpValue, creature, gameContext)
    : 0;

  if (!xpValue || !combat) return;

  // Find other side of combat
  const enemies = combat.allies.creatures.includes(creature)
    ? combat.enemies
    : combat.allies;

  // Distribute XP to all alive creatures on other side
  for (const enemyId of enemies.creatures) {
    const enemy = getCreature(enemyId, gameContext);
    if ("xp" in enemy && typeof enemy.xp === "number") {
      enemy.xp += xpValue;
    }
  }
}

export function getXpForNextLevel(level: number): number {
  return 100 * Math.pow(1.1, level);
}

export function getSkill(skill: SkillId, creature: CreatureInstance): number {
  const def = creatures[creature.definitionId];
  let val = def.skills?.[skill]
    ? getFromOptionalFunc(def.skills[skill], creature)
    : 0;

  if ("skills" in creature && typeof creature.skills === "object") {
    const skills = creature.skills as Partial<{
      [key in keyof typeof def.skills]: number;
    }>;
    val += skills[skill] ?? 0;
  }

  return val;
}
