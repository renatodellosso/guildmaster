import { CreatureInstance } from "@/lib/creature";
import { Context } from "@/lib/utilTypes";
import { ReactNode } from "react";
import { Tooltip } from "./Tooltip";
import {
  getMaxHealth,
  getMaxMana,
  getResistances,
  getSkill,
} from "@/lib/creatureUtils";
import { formatInt, titleCase, formatPercent } from "@/lib/format";
import { SkillId } from "@/lib/skills";
import StatusEffectDisplay from "./StatusEffectDisplay";

export default function CreatureTooltip({
  creature,
  context,
  children,
}: {
  creature: CreatureInstance;
  context: Context;
  children: ReactNode;
}) {
  const resistances = getResistances(creature, context.game);

  const tooltip = (
    <>
      <div>
        HP: {formatInt(creature.hp)}/
        {formatInt(getMaxHealth(creature, context.game))}
      </div>
      <div>
        Mana: {formatInt(creature.mana)}/
        {formatInt(getMaxMana(creature, context.game))}
      </div>
      <div>
        <strong>Skills:</strong>
        <ul>
          {Object.values(SkillId).map((skillId) => (
            <li key={skillId}>
              {skillId}: {formatInt(getSkill(skillId, creature, context.game))}
            </li>
          ))}
        </ul>
      </div>
      {resistances && Object.entries(resistances).length > 0 && (
        <div>
          <strong>Resistances:</strong>
          {Object.entries(resistances).map(([resistanceType, value]) => (
            <div key={resistanceType}>
              {titleCase(resistanceType)}: {formatPercent(value)}
            </div>
          ))}
        </div>
      )}
      {creature.statusEffects && creature.statusEffects.length > 0 && (
        <div className="flex flex-col">
          <strong>Status Effects:</strong>
          {creature.statusEffects.map((statusEffect, index) => (
            <StatusEffectDisplay
              key={index}
              instance={statusEffect}
              creature={creature}
              context={context}
            />
          ))}
        </div>
      )}
    </>
  );
  return <Tooltip content={tooltip}>{children}</Tooltip>;
}
