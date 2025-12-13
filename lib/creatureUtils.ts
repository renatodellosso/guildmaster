import { buildings } from "./content/buildings";
import { classes, ClassId } from "./content/classes";
import { CreatureDefId, creatures } from "./content/creatures";
import { DungeonId, dungeons } from "./content/dungeons";
import { items } from "./content/items";
import { statusEffects } from "./content/statusEffects";
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
  mergeDamages,
  mergeResistances,
  removeNonPositiveDamages,
  subtractDamage,
} from "./damage";
import { rollDrops } from "./drops";
import { addToExpeditionLog, Expedition } from "./expedition";
import { formatInt } from "./format";
import { GameContext } from "./gameContext";
import { addToInventory } from "./inventory";
import { EquipmentDefinition } from "./item";
import { SkillId } from "./skills";
import { StatusEffectInstance } from "./statusEffect";
import { chooseRandom, deepCopy, getCreature } from "./utils";
import { getFromOptionalFunc } from "./utilTypes";

export type ProviderWithSource = {
  def: CreatureProvider;
  source: CreatureProviderSource;
};

export function getProviders(
  creature: CreatureInstance,
  gameContext: GameContext
): ProviderWithSource[] {
  const providers: ProviderWithSource[] = [
    { def: creatures[creature.definitionId], source: creature },
  ];

  const ignoreGameProviders = !Object.keys(gameContext.roster).includes(
    String(creature.id)
  );
  if (!ignoreGameProviders) {
    // Add game-wide providers from buildings
    for (const buildingInstance of Object.values(gameContext.buildings)) {
      const buildingDef = buildings[buildingInstance.definitionId];
      if (buildingDef) {
        providers.push({ def: buildingDef, source: buildingInstance });
      }
    }
  }

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

  for (const statusEffect of creature.statusEffects || []) {
    providers.push({
      def: statusEffects[statusEffect.definitionId],
      source: statusEffect,
    });
  }

  return providers;
}

export function getMaxHealth(
  creature: CreatureInstance,
  gameContext: GameContext
): number {
  const providers = getProviders(creature, gameContext);

  let maxHp = 0;

  for (const provider of providers) {
    if (provider.def.maxHealth) {
      maxHp += getFromOptionalFunc(provider.def.maxHealth, {
        creature,
        gameContext,
        source: provider.source,
        prev: maxHp,
      });
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
  const providers = getProviders(creature, gameContext);

  let regen = 1;

  for (const provider of providers) {
    if (provider.def.healthRegen) {
      regen += getFromOptionalFunc(provider.def.healthRegen, {
        creature,
        prev: regen,
        gameContext,
        source: provider.source,
      });
    }
  }

  return regen;
}

export function getMaxMana(
  creature: CreatureInstance,
  gameContext: GameContext
): number {
  const providers = getProviders(creature, gameContext);

  let maxMana = 0;

  for (const provider of providers) {
    if (provider.def.maxMana) {
      maxMana += getFromOptionalFunc(provider.def.maxMana, {
        creature,
        prev: maxMana,
        gameContext,
        source: provider.source,
      });
    }
  }

  maxMana += 5 * getSkill(SkillId.Magic, creature, gameContext);

  return maxMana;
}

export function getManaRegen(
  creature: CreatureInstance,
  gameContext: GameContext
): number {
  const providers = getProviders(creature, gameContext);

  let regen = 1;

  for (const provider of providers) {
    if (provider.def.manaRegen) {
      regen += getFromOptionalFunc(provider.def.manaRegen, {
        creature,
        prev: regen,
        gameContext,
        source: provider.source,
      });
    }
  }

  return regen;
}

export function getSkill(
  skill: SkillId,
  creature: CreatureInstance,
  gameContext: GameContext
): number {
  const providers = getProviders(creature, gameContext);

  let val = 0;

  if ("skills" in creature) {
    const skillList = creature.skills as AdventurerInstance["skills"];
    if (skillList && typeof skillList[skill] === "number") {
      val += skillList[skill]!;
    }
  }

  for (const provider of providers) {
    if (provider.def.skills?.[skill]) {
      val += getFromOptionalFunc(provider.def.skills[skill], {
        creature,
        prev: val,
        gameContext,
        source: provider.source,
      });
    }
  }

  return val;
}

export function getResistances(
  creature: CreatureInstance,
  gameContext: GameContext
): DamageResistances {
  const providers = getProviders(creature, gameContext);

  const resistancesList: DamageResistances[] = [];

  for (const provider of providers) {
    if (provider.def.resistances) {
      const res = getFromOptionalFunc(provider.def.resistances, {
        creature,
        gameContext,
        source: provider.source,
      });
      resistancesList.push(res);
    }
  }

  return mergeResistances(resistancesList);
}

export function getActionsPerTurn(
  creature: CreatureInstance,
  gameContext: GameContext
): number {
  const providers = getProviders(creature, gameContext);

  let actions = 1;

  for (const provider of providers) {
    if (provider.def.actionsPerTurn) {
      actions += getFromOptionalFunc(provider.def.actionsPerTurn, {
        creature,
        prev: actions,
        gameContext,
        source: provider.source,
      });
    }
  }

  return actions;
}

export function getDamageToDeal(
  baseDamage: Damage[],
  caster: CreatureInstance,
  target: CreatureInstance,
  gameContext: GameContext
): Damage[] {
  const providers = getProviders(caster, gameContext);

  let finalDamage = baseDamage;

  for (const provider of providers) {
    if (provider.def.getDamageToDeal) {
      finalDamage =
        typeof provider.def.getDamageToDeal === "function"
          ? provider.def.getDamageToDeal({
              prev: finalDamage,
              dealer: caster,
              target,
              gameContext,
              source: provider.source,
            })
          : [...finalDamage, ...provider.def.getDamageToDeal];
      finalDamage = mergeDamages(finalDamage);
    }
  }

  return finalDamage;
}

export function getDamageToTake(
  baseDamage: Damage[],
  creature: CreatureInstance,
  dealtBy: CreatureInstance | undefined,
  gameContext: GameContext
): Damage[] {
  const providers = getProviders(creature, gameContext);

  let finalDamage = baseDamage;

  for (const provider of providers) {
    if (provider.def.getDamageToTake) {
      finalDamage =
        typeof provider.def.getDamageToTake === "function"
          ? provider.def.getDamageToTake({
              prev: finalDamage,
              creature,
              dealer: dealtBy,
              gameContext,
              source: provider.source,
            })
          : subtractDamage(finalDamage, provider.def.getDamageToTake);
      finalDamage = mergeDamages(finalDamage);
    }
  }

  return finalDamage;
}

export function onDealDamage(
  caster: CreatureInstance,
  target: CreatureInstance,
  damageDealt: Damage[],
  gameContext: GameContext,
  source?: CreatureProviderSource
): void {
  const providers = getProviders(caster, gameContext);

  for (const provider of providers) {
    if (provider.def.onDealDamage) {
      provider.def.onDealDamage({
        dealer: caster,
        target,
        damageDealt,
        gameContext,
        source,
      });
    }
  }
}

export function onKill(
  killer: CreatureInstance,
  killed: CreatureInstance,
  gameContext: GameContext,
  source?: CreatureProviderSource
): void {
  const providers = getProviders(killer, gameContext);

  for (const provider of providers) {
    if (provider.def.onKill) {
      provider.def.onKill({
        killer,
        killed,
        gameContext,
        source,
      });
    }
  }
}

export function getConstructionPerTick(
  adventurer: AdventurerInstance,
  gameContext: GameContext
): number {
  let progress = getSkill(SkillId.Construction, adventurer, gameContext) + 1;

  const providers = getProviders(adventurer, gameContext);

  for (const provider of providers) {
    if (provider.def.constructionPerTick) {
      progress += getFromOptionalFunc(provider.def.constructionPerTick, {
        creature: adventurer,
        prev: progress,
        gameContext,
        source: provider.source,
      });
    }
  }

  return progress;
}

export function getXpMultiplier(
  creature: CreatureInstance,
  gameContext: GameContext
): number {
  const providers = getProviders(creature, gameContext);

  let multiplier = 1;

  for (const provider of providers) {
    if (provider.def.xpMultiplier) {
      multiplier += getFromOptionalFunc(provider.def.xpMultiplier, {
        creature,
        prev: multiplier,
        gameContext,
        source: provider.source,
      });
    }
  }

  return multiplier;
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

export function regenMana(
  creature: CreatureInstance,
  amount: number,
  gameContext: GameContext
) {
  const originalMana = creature.mana;

  creature.mana = Math.min(
    creature.mana + amount,
    getMaxMana(creature, gameContext)
  );

  return originalMana - creature.mana;
}

export function takeDamage(
  creature: CreatureInstance,
  dealtBy: CreatureInstance | undefined,
  damage: Damage[],
  gameContext: GameContext,
  expedition?: Expedition
) {
  damage = deepCopy(damage);
  if (dealtBy) {
    damage = getDamageToDeal(damage, dealtBy, creature, gameContext);
  }
  damage = getDamageToTake(damage, creature, dealtBy, gameContext);

  const resistances = getResistances(creature, gameContext);
  damage = getDamageAfterResistances(damage, resistances);
  damage = removeNonPositiveDamages(damage);

  const originalHp = creature.hp;
  const damageDealt: Damage[] = [];

  for (const dmg of damage) {
    const toDeal = Math.min(creature.hp, dmg.amount);
    if (toDeal <= 0) continue;

    damageDealt.push({ type: dmg.type, amount: toDeal });
    creature.hp -= toDeal;
  }

  creature.hp = Math.max(creature.hp, 0);

  if (originalHp > 0 && creature.hp === 0) {
    if (dealtBy) onKill(dealtBy, creature, gameContext);
    onDie(creature, gameContext, expedition);
  }

  if (dealtBy) onDealDamage(dealtBy, creature, damageDealt, gameContext);
  return damageDealt;
}

export function takeManaDamage(creature: CreatureInstance, amount: number) {
  const originalMana = creature.mana;

  creature.mana -= amount;
  creature.mana = Math.max(creature.mana, 0);

  return originalMana - creature.mana;
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
        addXp(enemy, xpPerCreature, gameContext);
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

export function addStatusEffect(
  creature: CreatureInstance,
  status: StatusEffectInstance
) {
  const def = statusEffects[status.definitionId];
  if (def.allowDuplicate === false) {
    const existing = creature.statusEffects.find(
      (s) => s.definitionId === status.definitionId
    );

    if (existing) {
      // Refresh duration
      existing.duration =
        existing.duration === "infinite"
          ? existing.duration
          : status.duration === "infinite"
            ? status.duration
            : Math.max(existing.duration, status.duration);
      existing.strength = Math.max(existing.strength, status.strength);
      return;
    }
  }
  creature.statusEffects.push(status);
}

export function addXp(
  creature: AdventurerInstance,
  amount: number,
  gameContext: GameContext
) {
  const mult = getXpMultiplier(creature, gameContext);
  const totalXp = amount * mult;

  creature.xp += totalXp;
}

export function getXpForNextLevel(level: number): number {
  if (level <= 0) return 100;
  return getXpForNextLevel(level - 1) + 100 * Math.pow(1.3, level);
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

export function getClassString(creature: CreatureInstance): string {
  const list = Object.entries(creature.classes || {})
    .map(([cls, level]) => `${classes[cls as ClassId].name} ${level}`)
    .join(", ");

  return list != "" ? `(${list})` : "";
}

export function findDungeonsWithCreature(
  creatureId: CreatureDefId
): Set<DungeonId> {
  const dungeonNames = new Set<DungeonId>();

  for (const [dungeonId, dungeon] of Object.entries(dungeons)) {
    for (const encounter of dungeon.encounters.items) {
      if (encounter.item.some((c) => c.id === creatureId)) {
        dungeonNames.add(dungeonId as DungeonId);
        break;
      }
    }
  }

  return dungeonNames;
}

export function levelUpAdventurer(
  adventurer: AdventurerInstance,
  levels: number,
  classId: ClassId | undefined,
  skillId: SkillId | undefined
) {
  adventurer.level += levels;

  if (classId)
    adventurer.classes[classId] = (adventurer.classes[classId] || 0) + 1;

  if (!adventurer.skills) {
    adventurer.skills = {};
  }

  if (skillId)
    adventurer.skills[skillId] = (adventurer.skills[skillId] || 0) + levels;
}
