import { Ability } from "./ability";
import { AbilityPriority } from "./abilityPriority";
import { chooseMultipleRandomLivingTargetsWithinRange } from "./combat";
import { StatusEffectId, statusEffects } from "./content/statusEffects";
import { CreatureInstance } from "./creature";
import { addStatusEffect, getSkill, heal, takeDamage } from "./creatureUtils";
import { Damage } from "./damage";
import { addToExpeditionLog, Expedition } from "./expedition";
import { formatDamage, formatInt } from "./format";
import { GameContext } from "./gameContext";
import { SkillId } from "./skills";
import { deepCopy } from "./utils";
import { MakeRequired } from "./utilTypes";

type AttackParams = {
  name: string;
  description: string;
  range?: number;
  manaCost?: number;
  priority?: AbilityPriority;
  skill?: SkillId;
  targets?: number;
};

type ParsedAttackParams = MakeRequired<
  AttackParams,
  "range" | "manaCost" | "priority" | "skill" | "targets"
>;

function initParams<T extends AttackParams>(params: T): ParsedAttackParams & T {
  params.manaCost = params.manaCost ?? 0;
  params.range = params.range ?? 1;
  params.targets = params.targets ?? 1;
  params.priority = params.priority ?? AbilityPriority.Low;
  params.skill = params.range > 1 ? SkillId.Ranged : SkillId.Melee;
  return params as ParsedAttackParams & T;
}

export function attack(
  params: AttackParams & {
    damage: Damage[];
    onDealDamage?: (
      caster: CreatureInstance,
      targets: CreatureInstance[],
      damageDealt: Damage[],
      expedition: Expedition,
      gameContext: GameContext
    ) => void;
  }
): Ability {
  params = initParams(params);

  return {
    name: params.name,
    description: `${params.description} Deals ${formatDamage(
      params.damage
    )} damage to ${params.targets} target${params.targets !== 1 ? "s" : ""} within ${params.range} position of the front.`,
    canActivate: (caster) => caster.mana >= (params!.manaCost ?? 0),
    selectTargets: (_caster, expedition, gameContext) =>
      chooseMultipleRandomLivingTargetsWithinRange(
        expedition.combat.enemies,
        gameContext,
        params!.range!,
        params!.targets!
      ),
    activate: (caster, targets, expedition, gameContext) => {
      if (targets.length === 0 || !targets[0]) return;
      const damage = deepCopy(params!.damage);
      if (damage[0])
        damage[0].amount += getSkill(params!.skill!, caster, gameContext);

      const damageTaken = takeDamage(
        targets[0],
        caster,
        damage,
        gameContext,
        expedition
      );

      if (damageTaken.length > 0 && params!.onDealDamage) {
        params!.onDealDamage(
          caster,
          targets,
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
    priority: params.priority!,
  };
}

export function applyStatusEffect(
  params: AttackParams & {
    side: "ally" | "enemy";
    statusEffectId: StatusEffectId;
    duration: number;
    strength?: number;
  }
): Ability {
  params = initParams(params);
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
      return chooseMultipleRandomLivingTargetsWithinRange(
        potentialTargets,
        gameContext,
        3,
        params!.targets!
      );
    },
    activate: (caster, targets, expedition) => {
      if (targets.length === 0 || !targets[0]) return;

      for (const target of targets) {
        addStatusEffect(target, {
          definitionId: params!.statusEffectId,
          duration: params!.duration,
          strength: params!.strength!,
        });
      }

      addToExpeditionLog(
        expedition,
        `${caster.name} uses ${params!.name} on ${targets[0].name}, applying ${statusEffects[params!.statusEffectId].name} for ${params!.duration} turns.`
      );
    },
    priority: params.priority!,
  };
}

export function healAbility(
  params: AttackParams & {
    amount: number;
  }
): Ability {
  params = initParams(params);

  return {
    name: params.name,
    description: `${params.description} Heals ${params.amount} HP to ${params.targets} target${params.targets !== 1 ? "s" : ""}.`,
    canActivate: (caster) => caster.mana >= (params!.manaCost ?? 0),
    selectTargets: (_caster, expedition, gameContext) =>
      chooseMultipleRandomLivingTargetsWithinRange(
        expedition.combat.allies,
        gameContext,
        3,
        params!.targets!
      ),
    activate: (caster, targets, expedition, gameContext) => {
      if (targets.length === 0 || !targets[0]) return;

      const scaledAmount =
        params!.amount + getSkill(params!.skill!, caster, gameContext);

      for (const target of targets) {
        heal(target, scaledAmount, gameContext);
      }

      addToExpeditionLog(
        expedition,
        `${caster.name} uses ${params!.name} on ${targets[0].name}, healing ${formatInt(scaledAmount)} HP.`
      );
    },
    priority: params.priority!,
  };
}
