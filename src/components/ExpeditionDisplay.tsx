import { MainRegistryContext } from "@/lib/content/mainRegistryContext";
import { CreatureInstance } from "@/lib/creature";
import { Expedition } from "@/lib/expedition";
import { RegistryToCreatureId } from "@/lib/registry";
import { Context } from "@/lib/utilTypes";

export default function ExpeditionDisplay({
  expedition,
  context,
}: {
  expedition: Expedition<MainRegistryContext>;
  context: Context;
}) {
  const combat = expedition.combat;

  return (
    <div>
      <strong>Allies</strong>
      <ul>
        {combat.allies.creatures.map((creatureId) => {
          const creature =
            typeof creatureId === "string"
              ? context.game.roster[creatureId]
              : (creatureId as CreatureInstance<
                  RegistryToCreatureId<MainRegistryContext>
                >);
          return (
            <CreatureDisplay key={String(creature.id)} creature={creature} />
          );
        })}
      </ul>
      <strong>Enemies</strong>
      <ul>
        {combat.enemies.creatures.map((creatureId) => {
          const creature =
            typeof creatureId === "string"
              ? context.game.roster[creatureId]
              : (creatureId as CreatureInstance<
                  RegistryToCreatureId<MainRegistryContext>
                >);
          return (
            <CreatureDisplay key={String(creature.id)} creature={creature} />
          );
        })}
      </ul>
    </div>
  );
}

function CreatureDisplay({
  creature,
}: {
  creature: CreatureInstance<RegistryToCreatureId<MainRegistryContext>>;
}) {
  return (
    <li>
      {creature.name} - HP: {creature.hp}
    </li>
  );
}
