import { AbilityId } from "./abilityId";
import { chooseRandomLivingTarget } from "../combat";
import { CreatureDefinition } from "../creature";
import { getSkill, takeDamage } from "../creatureUtils";
import { DropTableEntry } from "../drops";
import { addToExpeditionLog } from "../expedition";
import { formatDamage } from "../format";
import { finishRegistry, RawRegistry } from "../registry";
import { SkillId } from "../skills";
import { Table } from "../table";
import { Id } from "../utilTypes";
import { DamageType } from "../damage";

export type CreatureDefId = "human" | "goblin";

const rawCreatures = {
  human: {
    name: "Human",
    maxHealth: 100,
    xpValue: 10,
    skills: {},
    abilities: [
      {
        id: AbilityId.Punch,
        name: "Punch",
        description: "Punch an enemy",
        activate: (caster, targets, expedition, gameContext) => {
          if (targets.length === 0 || !targets[0]) return;
          const damage = takeDamage(
            targets[0],
            [
              {
                type: DamageType.Bludgeoning,
                amount: 5 + getSkill(SkillId.Melee, caster, gameContext),
              },
            ],
            gameContext,
            expedition
          );

          addToExpeditionLog(
            expedition,
            `${caster.name} punches ${targets[0].name} for ${formatDamage(damage)} damage.`
          );
        },
        canActivate: () => true,
        selectTargets: (_caster, expedition, gameContext) =>
          chooseRandomLivingTarget(expedition.combat.enemies, gameContext),
        priority: 0,
      },
    ],
  },
  goblin: {
    name: "Goblin",
    maxHealth: 80,
    xpValue: 50,
    skills: {
      [SkillId.Melee]: 1,
    },
    drops: {
      chance: 0.5,
      table: new Table<DropTableEntry>([
        {
          weight: 1,
          item: { definitionId: "coin", amount: [1, 5] },
        },
        {
          weight: 0.1,
          item: { definitionId: "shieldBauble", amount: 1 },
        },
      ]),
    },
    abilities: [
      {
        id: AbilityId.Slash,
        name: "Slash",
        description: "Slash an enemy",
        activate: (caster, targets, expedition, gameContext) => {
          if (targets.length === 0 || !targets[0]) return;
          const damage = takeDamage(
            targets[0],
            [
              {
                type: DamageType.Slashing,
                amount:
                  caster.hp / 20 + getSkill(SkillId.Melee, caster, gameContext),
              },
            ],
            gameContext,
            expedition
          );

          addToExpeditionLog(
            expedition,
            `${caster.name} slashes ${targets[0].name} for ${formatDamage(damage)} damage!`
          );
        },
        canActivate: () => true,
        selectTargets: (_caster, expedition, gameContext) =>
          chooseRandomLivingTarget(expedition.combat.enemies, gameContext),
        priority: 0,
      },
    ],
  },
} satisfies RawRegistry<Id, CreatureDefinition>;

export const creatures = finishRegistry<CreatureDefId, CreatureDefinition>(
  rawCreatures
);
