import { CreatureInstance } from "@/lib/creature";
import { getMaxHealth } from "@/lib/creatureUtils";
import { Expedition } from "@/lib/expedition";
import { formatInt } from "@/lib/format";
import { getCreature } from "@/lib/utils";
import { Context } from "@/lib/utilTypes";
import InventoryDisplay from "./InventoryDisplay";

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
            <CreatureDisplay
              key={String(creature.id)}
              creature={creature}
              context={context}
            />
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
            <CreatureDisplay
              key={String(creature.id)}
              creature={creature}
              context={context}
            />
          );
        })}
      </ul>
      <div>
        <strong>Inventory:</strong>
        <InventoryDisplay inventory={expedition.inventory} context={context} />
      </div>
    </div>
  );
}

function CreatureDisplay({
  creature,
  context,
}: {
  creature: CreatureInstance;
  context: Context;
}) {
  return (
    <li>
      {creature.name} - HP: {formatInt(creature.hp)}/
      {formatInt(getMaxHealth(creature, context.game))}
    </li>
  );
}
