import { activities } from "@/lib/content/activities";
import { getMaxHealth, getXpForNextLevel } from "@/lib/creatureUtils";
import { formatInt } from "@/lib/format";
import { Context, getFromOptionalFunc } from "@/lib/utilTypes";

export default function RosterMenu({ context }: { context: Context }) {
  return (
    <div>
      <h1>Roster Menu</h1>
      <ul>
        {Object.values(context.game.roster).map((creature) => (
          <li key={String(creature.id)}>
            {creature.name} (HP: {formatInt(creature.hp)}/
            {formatInt(getMaxHealth(creature, context.game))}, XP:{" "}
            {formatInt(creature.xp)}/
            {formatInt(getXpForNextLevel(creature.level))}) -{" "}
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
