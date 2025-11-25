import { Combat } from "@/lib/combat";
import { CreatureInstance } from "@/lib/creature";
import { GameContext } from "@/lib/gameContext";
import { RegistryContext, RegistryToCreatureDefId } from "@/lib/registry";

export default function CombatDisplay<
  TRegistryContext extends RegistryContext,
>({
  combat,
  gameContext,
  registry,
}: {
  combat: Combat<TRegistryContext>;
  gameContext: GameContext<TRegistryContext>;
  registry: TRegistryContext;
}) {
  return (
    <div>
      <strong>Allies</strong>
      <ul>
        {combat.allies.creatures.map((creatureId) => {
          const creature =
            typeof creatureId === "string"
              ? gameContext.roster[creatureId]
              : (creatureId as CreatureInstance<
                  RegistryToCreatureDefId<TRegistryContext>
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
                  RegistryToCreatureDefId<TRegistryContext>
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
