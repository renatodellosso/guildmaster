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
      <strong>
        Allies{" "}
        {combat.allies.retreatTimer > -1 &&
          ` (Retreating in ${combat.allies.retreatTimer} turns)`}
      </strong>
      <ul>
        {combat.allies.creatures.map((creatureId) => {
          const creature = getCreature(creatureId, context.game);
          return (
            <CreatureDisplay key={String(creature.id)} creature={creature} />
          );
        })}
      </ul>
      <strong>
        Enemies{" "}
        {combat.enemies.retreatTimer > -1 &&
          ` (Retreating in ${combat.enemies.retreatTimer} turns)`}
      </strong>
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
