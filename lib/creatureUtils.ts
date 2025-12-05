import { creatures } from "./content/creatures";
import { items } from "./content/items";
import {
  AdventurerInstance,
  CreatureInstance,
  CreatureProvider,
} from "./creature";
import { rollDrops } from "./drops";
import { Expedition } from "./expedition";
import { GameContext } from "./gameContext";
import { addToInventory } from "./inventory";
import { EquipmentDefinition } from "./item";
import { SkillId } from "./skills";
import { chooseRandom, getCreature } from "./utils";
import { getFromOptionalFunc } from "./utilTypes";

function getProviders(creature: CreatureInstance): CreatureProvider[] {
  const providers: CreatureProvider[] = [creatures[creature.definitionId]];

  if ("equipment" in creature && typeof creature.equipment === "object") {
    const equipment = creature.equipment as AdventurerInstance["equipment"];
    for (const itemInstance of Object.values(equipment)) {
      if (!itemInstance) continue;

      const equipmentDef = items[
        itemInstance.definitionId
      ] as EquipmentDefinition;

      providers.push(equipmentDef);
    }
  }

  return providers;
}

export function getMaxHealth(
  creature: CreatureInstance,
  gameContext: GameContext
): number {
  const providers = getProviders(creature);

  let maxHp = 0;

  for (const provider of providers) {
    if (provider.maxHealth) {
      maxHp += getFromOptionalFunc(
        provider.maxHealth,
        creature,
        maxHp,
        gameContext
      );
    }
  }

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
  const providers = getProviders(creature);

  let regen = 1;

  for (const provider of providers) {
    if (provider.healthRegen) {
      regen += getFromOptionalFunc(
        provider.healthRegen,
        creature,
        regen,
        gameContext
      );
    }
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
        enemy.xp += xpValue / enemies.creatures.length;
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
    "ia",
    "is",
    "ara",
    "ora",
    "ine",
    "isa",
    "isia",
    "iri",
    "i",
  ];

  let name = chooseRandom(prefixes);

  const middleCount = Math.random() < 0.5 ? 0 : Math.random() < 0.5 ? 1 : 2;
  for (let i = 0; i < middleCount; i++) {
    name += chooseRandom(middles);
  }

  name += chooseRandom(suffixes);

  return name;
}
