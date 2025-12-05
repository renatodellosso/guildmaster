import { classes, ClassId } from "./content/classes";
import { creatures } from "./content/creatures";
import { items } from "./content/items";
import {
  AdventurerInstance,
  CreatureInstance,
  CreatureProvider,
  CreatureProviderSource,
} from "./creature";
import {
  Damage,
  DamageResistances,
  getDamageAfterResistances,
  mergeResistances,
} from "./damage";
import { rollDrops } from "./drops";
import { addToExpeditionLog, Expedition } from "./expedition";
import { formatInt } from "./format";
import { GameContext } from "./gameContext";
import { addToInventory } from "./inventory";
import { EquipmentDefinition } from "./item";
import { SkillId } from "./skills";
import { chooseRandom, getCreature } from "./utils";
import { getFromOptionalFunc } from "./utilTypes";

export type ProviderWithSource = {
  def: CreatureProvider;
  source: CreatureProviderSource;
};

export function getProviders(creature: CreatureInstance): ProviderWithSource[] {
  const providers: ProviderWithSource[] = [
    { def: creatures[creature.definitionId], source: creature },
  ];

  for (const cls of Object.entries(creature.classes)) {
    const id = cls[0] as ClassId;
    const classDef = classes[id];
    if (classDef) {
      providers.push({ def: classDef, source: cls[1] });
    }
  }

  if ("equipment" in creature && typeof creature.equipment === "object") {
    const equipment = creature.equipment as AdventurerInstance["equipment"];
    for (const itemInstance of Object.values(equipment)) {
      if (!itemInstance) continue;

      const equipmentDef = items[
        itemInstance.definitionId
      ] as EquipmentDefinition;

      providers.push({ def: equipmentDef, source: itemInstance });
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
    if (provider.def.maxHealth) {
      maxHp += getFromOptionalFunc(
        provider.def.maxHealth,
        creature,
        maxHp,
        gameContext,
        provider.source
      );
    }
  }

  maxHp += 5 * getSkill(SkillId.Endurance, creature, gameContext);

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
    if (provider.def.healthRegen) {
      regen += getFromOptionalFunc(
        provider.def.healthRegen,
        creature,
        regen,
        gameContext,
        provider.source
      );
    }
  }

  return regen;
}

export function getSkill(
  skill: SkillId,
  creature: CreatureInstance,
  gameContext: GameContext
): number {
  const providers = getProviders(creature);

  let val = 0;

  if ("skills" in creature) {
    const skillList = creature.skills as AdventurerInstance["skills"];
    if (skillList && typeof skillList[skill] === "number") {
      val += skillList[skill]!;
    }
  }

  for (const provider of providers) {
    if (provider.def.skills?.[skill]) {
      val += getFromOptionalFunc(
        provider.def.skills[skill],
        creature,
        val,
        gameContext,
        provider.source
      );
    }
  }

  return val;
}

export function getResistances(
  creature: CreatureInstance,
  gameContext: GameContext
): DamageResistances {
  const providers = getProviders(creature);

  const resistancesList: DamageResistances[] = [];

  for (const provider of providers) {
    if (provider.def.resistances) {
      const res = getFromOptionalFunc(
        provider.def.resistances,
        creature,
        gameContext,
        provider.source
      );
      resistancesList.push(res);
    }
  }

  return mergeResistances(resistancesList);
}

export function heal(
  creature: CreatureInstance,
  amount: number,
  gameContext: GameContext
) {
  const originalHp = creature.hp;

  creature.hp = Math.min(
    creature.hp + amount,
    getMaxHealth(creature, gameContext)
  );

  return originalHp - creature.hp;
}

export function takeDamage(
  creature: CreatureInstance,
  damage: Damage[],
  gameContext: GameContext,
  expedition?: Expedition
) {
  const resistances = getResistances(creature, gameContext);
  const finalDamages = getDamageAfterResistances(damage, resistances);

  const originalHp = creature.hp;
  const damageDealt: Damage[] = [];

  for (const dmg of finalDamages) {
    const toDeal = Math.min(creature.hp, dmg.amount);
    if (toDeal <= 0) continue;

    damageDealt.push({ type: dmg.type, amount: toDeal });
    creature.hp -= toDeal;
  }

  creature.hp = Math.max(creature.hp, 0);

  if (originalHp > 0 && creature.hp === 0) {
    onDie(creature, gameContext, expedition);
  }

  return damageDealt;
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

  // Remove temporary status effects
  creature.statusEffects = creature.statusEffects?.filter(
    (statusEffect) => statusEffect.duration === "infinite"
  );

  if (!expedition) return;

  let msg = `${creature.name} has died!`;

  if (xpValue) {
    // Find other side of combat
    const enemies = expedition.combat.allies.creatures.includes(creature)
      ? expedition.combat.enemies
      : expedition.combat.allies;

    const xpPerCreature = xpValue / enemies.creatures.length;
    msg += ` ${formatInt(xpPerCreature)} XP awarded.`;

    // Distribute XP to all alive creatures on other side
    for (const enemyId of enemies.creatures) {
      const enemy = getCreature(enemyId, gameContext);
      if ("xp" in enemy && typeof enemy.xp === "number") {
        enemy.xp += xpPerCreature;
      }
    }
  }

  addToExpeditionLog(expedition, msg);

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
    "An",
    "El",
    "Il",
    "Es",
    "Or",
    "En",
  ];
  const middles = [
    "an",
    "en",
    "in",
    "or",
    "ur",
    "el",
    "al",
    "ir",
    "ar",
    "es",
    "end",
    "ist",
  ];
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
    "a",
    "s",
    "ist",
    "isk",
  ];

  let name = chooseRandom(prefixes);

  const middleCount = Math.random() < 0.5 ? 0 : Math.random() < 0.5 ? 1 : 2;
  for (let i = 0; i < middleCount; i++) {
    name += chooseRandom(middles);
  }

  name += chooseRandom(suffixes);

  return name;
}
