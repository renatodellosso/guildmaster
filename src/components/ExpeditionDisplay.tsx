import { CreatureInstance } from "@/lib/creature";
import { getMaxHealth, getMaxMana } from "@/lib/creatureUtils";
import { Expedition } from "@/lib/expedition";
import { formatInt } from "@/lib/format";
import { getCreature } from "@/lib/utils";
import { Context } from "@/lib/utilTypes";
import InventoryDisplay from "./InventoryDisplay";
import CreatureTooltip from "./CreatureTooltip";
import { dungeons } from "@/lib/content/dungeons";
import { forceStartRetreat } from "@/lib/combat";
import { Tooltip } from "./Tooltip";

export default function ExpeditionDisplay({
  expedition,
  context,
}: {
  expedition: Expedition;
  context: Context;
}) {
  const combat = expedition.combat;
  const dungeon = dungeons[expedition.dungeonId];

  function retreat() {
    forceStartRetreat(expedition);
    context.updateGameState();
  }

  return (
    <div>
      <div className="flex gap-2">
        <strong>Expedition to {dungeon.name}</strong>
        {expedition.combat.allies.retreatTimer == -1 && (
          <button onClick={retreat}>Retreat</button>
        )}
      </div>
      <div className="flex gap-4">
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
          {expedition.regenerating ? (
            <i>Regenerating health...</i>
          ) : (
            <>
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
            </>
          )}
        </div>
        <div>
          <strong>Expedition Log:</strong>
          <div className="overflow-y-scroll pr-1">
            {expedition.log.map((entry, index) => (
              <div key={index}>{entry}</div>
            ))}
          </div>
        </div>
      </div>
      <div>
        <Tooltip content="Will be returned to the guild's inventory if the current fight is won. Will be lost if all allies are defeated.">
          <strong>Inventory (?):</strong>
        </Tooltip>
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
  const maxMana = getMaxMana(creature, context.game);

  return (
    <li className={creature.hp <= 0 ? "line-through" : ""}>
      <CreatureTooltip creature={creature} context={context}>
        {creature.name} - HP: {formatInt(creature.hp)}/
        {formatInt(getMaxHealth(creature, context.game))}
        {maxMana > 0 && (
          <>
            , Mana: {formatInt(creature.mana)}/{formatInt(maxMana)}
          </>
        )}
      </CreatureTooltip>
    </li>
  );
}
