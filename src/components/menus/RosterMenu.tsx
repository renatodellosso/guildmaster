import { GameContext } from "@/lib/gameContext";
import { RegistryContext } from "@/lib/registry";

export default function RosterMenu<TRegistryContext extends RegistryContext>({
  gameContext,
  registry,
}: {
  gameContext: GameContext<TRegistryContext>;
  registry: TRegistryContext;
}) {
  return (
    <div>
      <h1>Roster Menu</h1>
      <ul>
        {Object.values(gameContext.roster).map((creature) => (
          <li key={String(creature.id)}>
            {registry.creatures[creature.definitionId].name} (HP: {creature.hp})
          </li>
        ))}
      </ul>
    </div>
  );
}
