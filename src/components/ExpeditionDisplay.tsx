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
            <li key={String(creature.id)}>
              {String(creature.id)} - HP: {creature.hp}
            </li>
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
            <li key={String(creature.id)}>
              {String(creature.id)} - HP: {creature.hp}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
