import { CreatureInstance } from "@/lib/creature";
import { Expedition } from "@/lib/expedition";
import { GameContext } from "@/lib/gameContext";
import { RegistryContext, RegistryToCreatureId } from "@/lib/registry";

export default function ExpeditionDisplay<
  TRegistryContext extends RegistryContext,
>({
  expedition,
  gameContext,
}: {
  expedition: Expedition<TRegistryContext>;
  gameContext: GameContext<TRegistryContext>;
  registry: TRegistryContext;
}) {
  const combat = expedition.combat;

  return (
    <div>
      <strong>Allies</strong>
      <ul>
        {combat.allies.creatures.map((creatureId) => {
          const creature =
            typeof creatureId === "string"
              ? gameContext.roster[creatureId]
              : (creatureId as CreatureInstance<
                  RegistryToCreatureId<TRegistryContext>
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
              ? gameContext.roster[creatureId]
              : (creatureId as CreatureInstance<
                  RegistryToCreatureId<TRegistryContext>
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
