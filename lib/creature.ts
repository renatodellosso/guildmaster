import { Ability, AbilityFuncParamsWithoutTargets } from "./ability";
import { ActivityInstance } from "./activity";
import { CreatureDefId, creatures } from "./content/creatures";
import { getMaxHealth } from "./creatureUtils";
import { DamageResistances } from "./damage";
import { Drops } from "./drops";
import { GameContext } from "./gameContext";
import { EquipmentSlot, ItemInstance } from "./item";
import { SkillList } from "./skills";
import { randomId } from "./utils";
import { Id, MakeRequired, OptionalFunc } from "./utilTypes";

export type CreatureProviderSource = CreatureInstance | ItemInstance;

export type CreatureProvider = {
  maxHealth?: OptionalFunc<
    number,
    [CreatureInstance, number, GameContext, CreatureProviderSource]
  >;
  healthRegen?: OptionalFunc<
    number,
    [CreatureInstance, number, GameContext, CreatureProviderSource]
  >;
  skills?: Partial<{
    [key in keyof SkillList]: OptionalFunc<
      number,
      [CreatureInstance, number, GameContext, CreatureProviderSource]
    >;
  }>;
  abilities?: OptionalFunc<Ability[], AbilityFuncParamsWithoutTargets>;
  resistances?: OptionalFunc<
    DamageResistances,
    [CreatureInstance, GameContext, CreatureProviderSource]
  >;
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

  equipment: { [slot in EquipmentSlot]?: ItemInstance };
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
    equipment: {},
  };

  creature.hp = getMaxHealth(creature, gameContext);

  return creature;
}
