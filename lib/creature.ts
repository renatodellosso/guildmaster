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

export type CreatureProvider = Tickable<{
  creature: CreatureInstance;
  source: CreatureProviderSource;
}> & {
  maxHealth?: OptionalFunc<
    number,
    [CreatureInstance, number, GameContext, CreatureProviderSource | undefined]
  >;
  healthRegen?: OptionalFunc<
    number,
    [CreatureInstance, number, GameContext, CreatureProviderSource | undefined]
  >;
  maxMana?: OptionalFunc<
    number,
    [CreatureInstance, number, GameContext, CreatureProviderSource | undefined]
  >;
  manaRegen?: OptionalFunc<
    number,
    [CreatureInstance, number, GameContext, CreatureProviderSource | undefined]
  >;
  skills?: Partial<{
    [key in keyof SkillList]: OptionalFunc<
      number,
      [
        CreatureInstance,
        number,
        GameContext,
        CreatureProviderSource | undefined,
      ]
    >;
  }>;
  abilities?: OptionalFunc<Ability[], AbilityFuncParamsWithoutTargets>;
  resistances?: OptionalFunc<
    DamageResistances,
    [CreatureInstance, GameContext, CreatureProviderSource | undefined]
  >;
  actionsPerTurn?: OptionalFunc<
    number,
    [CreatureInstance, number, GameContext, CreatureProviderSource | undefined]
  >;
  /**
   * If not a function, this value is treated as a flat bonus to all damage dealt.
   */
  getDamageToDeal?: OptionalFunc<
    Damage[],
    [
      Damage[],
      CreatureInstance,
      CreatureInstance,
      GameContext,
      CreatureProviderSource | undefined,
    ]
  >;
  /** If not a function, this value is treated as a flat minus to all damage taken. */
  getDamageToTake?: OptionalFunc<
    Damage[],
    [
      Damage[],
      CreatureInstance,
      CreatureInstance | undefined,
      GameContext,
      CreatureProviderSource | undefined,
    ]
  >;
  onDealDamage?: (
    caster: CreatureInstance,
    target: CreatureInstance,
    damageDealt: Damage[],
    gameContext: GameContext,
    source: CreatureProviderSource | undefined
  ) => void;
  onKill?: (
    killer: CreatureInstance,
    killed: CreatureInstance,
    gameContext: GameContext,
    source: CreatureProviderSource | undefined
  ) => void;
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
