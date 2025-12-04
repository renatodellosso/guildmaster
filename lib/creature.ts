import { Ability, AbilityFuncParamsWithoutTargets } from "./ability";
import { ActivityInstance } from "./activity";
import { CreatureDefId, creatures } from "./content/creatures";
import { getMaxHealth } from "./creatureUtils";
import { GameContext } from "./gameContext";
import { SkillList } from "./skills";
import { randomId } from "./utils";
import { Id, MakeRequired, OptionalFunc } from "./utilTypes";

export type CreatureProvider = {
  maxHealth?: OptionalFunc<number, [CreatureInstance, number, GameContext]>;
  healthRegenWhileResting?: OptionalFunc<
    number,
    [CreatureInstance, number, GameContext]
  >;
  xpValue?: OptionalFunc<number, [CreatureInstance, GameContext]>;
};

type DefProvider = MakeRequired<CreatureProvider, "maxHealth">;

export type CreatureDefinition = DefProvider & {
  id: CreatureDefId;
  name: string;
  skills: SkillList<[CreatureInstance]>;
  abilities?: OptionalFunc<Ability[], AbilityFuncParamsWithoutTargets>;
};

export type CreatureInstance = {
  id: Id;
  definitionId: CreatureDefId;
  name: string;

  hp: number;
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
  };

  creature.hp = getMaxHealth(creature, gameContext);

  return creature;
}
