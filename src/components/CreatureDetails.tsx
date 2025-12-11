import { CreatureInstance } from "@/lib/creature";
import {
  getResistances,
  getClassString,
  getMaxHealth,
  getMaxMana,
  getSkill,
  findDungeonsWithCreature,
} from "@/lib/creatureUtils";
import { formatInt, titleCase, formatPercent } from "@/lib/format";
import { SkillId } from "@/lib/skills";
import { Context } from "@/lib/utilTypes";
import StatusEffectDisplay from "./StatusEffectDisplay";
import { creatures } from "@/lib/content/creatures";
import { items } from "@/lib/content/items";
import { dungeons } from "@/lib/content/dungeons";

export default function CreatureDetails({
  creature,
  context,
}: {
  creature: CreatureInstance;
  context: Context;
}) {
  const resistances = getResistances(creature, context.game);
  const def = creatures[creature.definitionId];

  const totalDropWeight = def.drops
    ? def.drops!.table.items.reduce((sum, drop) => sum + drop.weight, 0)
    : 0;

  const appearsIn = findDungeonsWithCreature(creature.definitionId);

  return (
    <div className="flex flex-col">
      <h1>{creature.name}</h1>
      <div>{getClassString(creature)}</div>
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
          <ul>
            {Object.entries(resistances).map(([resistanceType, value]) => (
              <li key={resistanceType}>
                {titleCase(resistanceType)}: {formatPercent(value)}
              </li>
            ))}
          </ul>
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
      {def.drops && (
        <div>
          <strong>Drops ({formatPercent(def.drops.chance)} chance):</strong>
          <ul>
            {def.drops!.table.items.map((drop, index) => (
              <li key={index}>
                {items[drop.item.definitionId].name} x
                {Array.isArray(drop.item.amount)
                  ? `${drop.item.amount[0]}-${drop.item.amount[1]}`
                  : drop.item.amount}{" "}
                ({formatPercent(drop.weight / totalDropWeight)} chance)
              </li>
            ))}
          </ul>
        </div>
      )}
      {appearsIn.size > 0 && (
        <div>
          <strong>Appears In:</strong>
          <ul>
            {[...appearsIn].map((dungeon) => (
              <li key={dungeon}>{dungeons[dungeon].name}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
