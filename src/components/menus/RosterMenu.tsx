import { activities } from "@/lib/content/activities";
import { Context, getFromOptionalFunc } from "@/lib/utilTypes";

export default function RosterMenu({ context }: { context: Context }) {
  return (
    <div>
      <h1>Roster Menu</h1>
      <ul>
        {Object.values(context.game.roster).map((creature) => (
          <li key={String(creature.id)}>
            {context.registry.creatures[creature.definitionId].name} (HP:{" "}
            {creature.hp}) -{" "}
            {getFromOptionalFunc(
              activities[creature.activity.definitionId].getDescription,
              creature,
              context.game,
              context.registry
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
