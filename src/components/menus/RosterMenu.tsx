import { activities } from "@/lib/content/activities";
import { getMaxHealth } from "@/lib/creatureUtils";
import { Context, getFromOptionalFunc } from "@/lib/utilTypes";

export default function RosterMenu({ context }: { context: Context }) {
  return (
    <div>
      <h1>Roster Menu</h1>
      <ul>
        {Object.values(context.game.roster).map((creature) => (
          <li key={String(creature.id)}>
            {creature.name} (HP: {creature.hp}/
            {getMaxHealth(creature, context.game)}) -{" "}
            {getFromOptionalFunc(
              activities[creature.activity.definitionId].description,
              creature,
              context.game
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
