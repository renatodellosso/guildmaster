import { Ability, AbilityFuncParamsWithoutTargets } from "./ability";
import { ActivityInstance } from "./activity";
import { BuildingInstance } from "./building";
import { ClassId } from "./content/classes";
import { CreatureDefId, creatures } from "./content/creatures";
import { getMaxHealth } from "./creatureUtils";
import { Damage, DamageResistances } from "./damage";
import { Drops } from "./drops";
import { EquipmentSlot } from "./equipmentSlot";
import { GameContext } from "./gameContext";
import { ItemInstance } from "./item";
import { SkillList } from "./skills";
import { StatusEffectInstance } from "./statusEffect";
import { randomId } from "./utils";
import { Id, MakeRequired, OptionalFunc, Tickable } from "./utilTypes";

export type CreatureProviderSource =
  | CreatureInstance
  | ItemInstance
  | StatusEffectInstance
  | BuildingInstance
  | number; // For class levels

export type CreatureProviderArgsBase = {
  creature: CreatureInstance;
  gameContext: GameContext;
  source?: CreatureProviderSource;
};

export type CreatureProviderArgsNumber = CreatureProviderArgsBase & {
  prev: number;
};

export type CreatureProvider = Tickable<{
  creature: CreatureInstance;
  source: CreatureProviderSource;
}> & {
  maxHealth?: OptionalFunc<number, [CreatureProviderArgsNumber]>;
  healthRegen?: OptionalFunc<number, [CreatureProviderArgsNumber]>;
  maxMana?: OptionalFunc<number, [CreatureProviderArgsNumber]>;
  manaRegen?: OptionalFunc<number, [CreatureProviderArgsNumber]>;
  skills?: Partial<{
    [key in keyof SkillList]: OptionalFunc<
      number,
      [CreatureProviderArgsNumber]
    >;
  }>;
  abilities?: OptionalFunc<Ability[], AbilityFuncParamsWithoutTargets>;
  resistances?: OptionalFunc<DamageResistances, [CreatureProviderArgsBase]>;
  actionsPerTurn?: OptionalFunc<number, [CreatureProviderArgsNumber]>;
  /**
   * If not a function, this value is treated as a flat bonus to all damage dealt.
   */
  getDamageToDeal?: OptionalFunc<
    Damage[],
    [
      {
        prev: Damage[];
        target: CreatureInstance;
        dealer: CreatureInstance;
        gameContext: GameContext;
        source: CreatureProviderSource | undefined;
      },
    ]
  >;
  /** If not a function, this value is treated as a flat minus to all damage taken. */
  getDamageToTake?: OptionalFunc<
    Damage[],
    [
      {
        prev: Damage[];
        creature: CreatureInstance;
        dealer: CreatureInstance | undefined;
        gameContext: GameContext;
        source: CreatureProviderSource | undefined;
      },
    ]
  >;
  onDealDamage?: (args: {
    dealer: CreatureInstance;
    target: CreatureInstance;
    damageDealt: Damage[];
    gameContext: GameContext;
    source: CreatureProviderSource | undefined;
  }) => void;
  onKill?: (args: {
    killer: CreatureInstance;
    killed: CreatureInstance;
    gameContext: GameContext;
    source: CreatureProviderSource | undefined;
  }) => void;
  constructionPerTick?: OptionalFunc<number, [CreatureProviderArgsNumber]>;
  xpMultiplier?: OptionalFunc<number, [CreatureProviderArgsNumber]>;
};

type DefProvider = MakeRequired<CreatureProvider, "maxHealth">;

export type CreatureDefinition = DefProvider & {
  id: CreatureDefId;
  name: string;
  skills: SkillList<[CreatureInstance]>;
  drops?: Drops;
  xpValue?: OptionalFunc<number, [CreatureInstance, GameContext]>;
};

export type CreatureInstance = {
  id: Id;
  definitionId: CreatureDefId;
  name: string;
  hp: number;
  mana: number;
  equipment: { [slot in EquipmentSlot]?: ItemInstance };
  statusEffects: StatusEffectInstance[];
  classes: {
    [key in ClassId]?: number;
  };
};

export type AdventurerInstance = CreatureInstance & {
  activity: ActivityInstance;
  xp: number;
  level: number;
  skills: Partial<{
    [key in keyof SkillList]: number;
  }>;
};

export function createCreatureInstance(
  defId: CreatureDefId,
  gameContext: GameContext
): CreatureInstance {
  const creature: CreatureInstance = {
    id: randomId(),
    definitionId: defId,
    name: creatures[defId].name,
    hp: 0,
    mana: 0,
    equipment: {},
    statusEffects: [],
    classes: {},
  };

  creature.hp = getMaxHealth(creature, gameContext);

  return creature;
}
