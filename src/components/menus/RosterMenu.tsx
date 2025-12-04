import { activities } from "@/lib/content/activities";
import { getMaxHealth, getXpForNextLevel } from "@/lib/creatureUtils";
import { formatInt } from "@/lib/format";
import { Context, getFromOptionalFunc, Id } from "@/lib/utilTypes";
import { useState } from "react";
import { AdventurerDisplay } from "../AdventurerDisplay";

export default function RosterMenu({ context }: { context: Context }) {
  const [selectedId, setSelectedId] = useState<Id>();

  return (
    <div>
      <h1>Roster Menu</h1>
      <div className="flex">
        <div className="flex flex-col overflow-y-scroll">
          {Object.values(context.game.roster).map((creature) => (
            <button
              key={String(creature.id)}
              onClick={() => setSelectedId(creature.id)}
            >
              {creature.name} (HP: {formatInt(creature.hp)}/
              {formatInt(getMaxHealth(creature, context.game))}, XP:{" "}
              {formatInt(creature.xp)}/
              {formatInt(getXpForNextLevel(creature.level))}) -{" "}
              {getFromOptionalFunc(
                activities[creature.activity.definitionId].description,
                creature,
                context.game
              )}
            </button>
          ))}
        </div>
        {selectedId && context.game.roster[selectedId] ? (
          <AdventurerDisplay
            adventurer={context.game.roster[selectedId]}
            context={context}
          />
        ) : (
          <div className="px-2">Select an adventurer to view details.</div>
        )}
      </div>
    </div>
  );
}
