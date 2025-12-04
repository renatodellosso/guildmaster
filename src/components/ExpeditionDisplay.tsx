import { CreatureInstance } from "@/lib/creature";
import { Expedition } from "@/lib/expedition";
import { getCreature } from "@/lib/utils";
import { Context } from "@/lib/utilTypes";

export default function ExpeditionDisplay({
  expedition,
  context,
}: {
  expedition: Expedition;
  context: Context;
}) {
  const combat = expedition.combat;

  return (
    <div>
      <strong>Allies</strong>
      <ul>
        {combat.allies.creatures.map((creatureId) => {
          const creature = getCreature(creatureId, context.game);
          return (
            <CreatureDisplay key={String(creature.id)} creature={creature} />
          );
        })}
      </ul>
      <strong>Enemies</strong>
      <ul>
        {combat.enemies.creatures.map((creatureId) => {
          const creature = getCreature(creatureId, context.game);
          return (
            <CreatureDisplay key={String(creature.id)} creature={creature} />
          );
        })}
      </ul>
    </div>
  );
}

function CreatureDisplay({ creature }: { creature: CreatureInstance }) {
  return (
    <li>
      {creature.name} - HP: {creature.hp}
    </li>
  );
}
