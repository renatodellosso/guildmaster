import { Ability } from "./ability";
import { AbilityPriority } from "./abilityPriority";
import { chooseRandomLivingTargetWithinRange } from "./combat";
import { StatusEffectId } from "./content/statusEffects";
import { CreatureInstance } from "./creature";
import { getSkill, takeDamage } from "./creatureUtils";
import { Damage } from "./damage";
import { addToExpeditionLog, Expedition } from "./expedition";
import { formatDamage } from "./format";
import { GameContext } from "./gameContext";
import { SkillId } from "./skills";
import { deepCopy } from "./utils";

export function attack(params: {
  name: string;
  description: string;
  damage: Damage[];
  range?: number;
  manaCost?: number;
  priority?: AbilityPriority;
  skill?: SkillId;
  onDealDamage?: (
    caster: CreatureInstance,
    target: CreatureInstance,
    damageDealt: Damage[],
    expedition: Expedition,
    gameContext: GameContext
  ) => void;
}): Ability {
  params.manaCost = params.manaCost ?? 0;
  params.range = params.range ?? 1;
  params.priority = params.priority ?? AbilityPriority.Low;

  params.skill = params.range > 1 ? SkillId.Ranged : SkillId.Melee;

  return {
    name: params.name,
    description: `${params.description} Deals ${formatDamage(
      params.damage
    )} damage to a target within ${params.range} position of the front.`,
    canActivate: (caster) => caster.mana >= (params!.manaCost ?? 0),
    selectTargets: (_caster, expedition, gameContext) =>
      chooseRandomLivingTargetWithinRange(
        expedition.combat.enemies,
        gameContext,
        params!.range!
      ),
    activate: (caster, targets, expedition, gameContext) => {
      if (targets.length === 0 || !targets[0]) return;
      const damage = deepCopy(params!.damage);
      if (damage[0])
        damage[0].amount += getSkill(params!.skill!, caster, gameContext);

      const damageTaken = takeDamage(
        targets[0],
        damage,
        gameContext,
        expedition
      );

      if (damageTaken.length > 0 && params!.onDealDamage) {
        params!.onDealDamage(
          caster,
          targets[0],
          damageTaken,
          expedition!,
          gameContext
        );
      }

      addToExpeditionLog(
        expedition,
        `${caster.name} uses ${params!.name} on ${targets[0].name} for ${formatDamage(
          damageTaken
        )} damage.`
      );
    },
    priority: params.priority,
  };
}

export function applyStatusEffect(params: {
  name: string;
  description: string;
  statusEffectId: StatusEffectId;
  duration: number;
  strength?: number;
  manaCost?: number;
  priority?: AbilityPriority;
  side: "ally" | "enemy";
}): Ability {
  params.manaCost = params.manaCost ?? 0;
  params.priority = params.priority ?? AbilityPriority.Low;
  params.strength = params.strength ?? 1;

  return {
    name: params.name,
    description: params.description,
    canActivate: (caster) => caster.mana >= (params!.manaCost ?? 0),
    selectTargets: (_caster, expedition, gameContext) => {
      const potentialTargets =
        params!.side === "ally"
          ? expedition.combat.allies
          : expedition.combat.enemies;
      return chooseRandomLivingTargetWithinRange(
        potentialTargets,
        gameContext,
        3
      );
    },
    activate: (caster, targets, expedition) => {
      if (targets.length === 0 || !targets[0]) return;

      targets[0].statusEffects.push({
        definitionId: params!.statusEffectId,
        duration: params!.duration,
        strength: params!.strength!,
      });

      addToExpeditionLog(
        expedition,
        `${caster.name} uses ${params!.name} on ${targets[0].name}, applying ${params!.statusEffectId} for ${params!.duration} turns.`
      );
    },
    priority: params.priority,
  };
}
