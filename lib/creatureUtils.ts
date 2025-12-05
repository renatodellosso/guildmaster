import { creatures } from "./content/creatures";
import { CreatureInstance } from "./creature";
import { rollDrops } from "./drops";
import { Expedition } from "./expedition";
import { GameContext } from "./gameContext";
import { addToInventory } from "./inventory";
import { SkillId } from "./skills";
import { chooseRandom, getCreature } from "./utils";
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

  if ("level" in creature && typeof creature.level === "number") {
    maxHp += creature.level * 10;
  }

  return maxHp;
}

export function getHealthRegen(
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
  expedition?: Expedition
): void {
  const originalHp = creature.hp;

  creature.hp = Math.max(creature.hp - amount, 0);

  if (originalHp > 0 && creature.hp === 0) {
    onDie(creature, gameContext, expedition);
  }
}

export function onDie(
  creature: CreatureInstance,
  gameContext: GameContext,
  expedition?: Expedition
): void {
  const def = creatures[creature.definitionId];
  const xpValue = def.xpValue
    ? getFromOptionalFunc(def.xpValue, creature, gameContext)
    : 0;

  if (!expedition) return;

  if (xpValue) {
    // Find other side of combat
    const enemies = expedition.combat.allies.creatures.includes(creature)
      ? expedition.combat.enemies
      : expedition.combat.allies;

    // Distribute XP to all alive creatures on other side
    for (const enemyId of enemies.creatures) {
      const enemy = getCreature(enemyId, gameContext);
      if ("xp" in enemy && typeof enemy.xp === "number") {
        enemy.xp += xpValue;
      }
    }
  }

  if (def.drops) {
    const drops = def.drops;
    const droppedItems = rollDrops(drops);

    addToInventory(expedition.inventory, droppedItems);
  }
}

export function getXpForNextLevel(level: number): number {
  if (level <= 0) return 100;
  return getXpForNextLevel(level - 1) + 100 * Math.pow(1.1, level);
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

export function randomName(): string {
  const prefixes = [
    "Gor",
    "Zan",
    "Mor",
    "Tar",
    "Lun",
    "Vor",
    "Fen",
    "Rag",
    "Dru",
    "Kal",
  ];
  const middles = ["an", "en", "in", "or", "ur", "el", "al", "ir", "ar", "es"];
  const suffixes = [
    "thar",
    "gorn",
    "dil",
    "mar",
    "nus",
    "rak",
    "zor",
    "lin",
    "dus",
    "fen",
  ];

  let name = chooseRandom(prefixes);

  const middleCount = Math.random() < 0.5 ? 0 : Math.random() < 0.5 ? 1 : 2;
  for (let i = 0; i < middleCount; i++) {
    name += chooseRandom(middles);
  }

  name += chooseRandom(suffixes);

  return name;
}
