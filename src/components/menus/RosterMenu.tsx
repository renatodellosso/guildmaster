import { activities } from "@/lib/content/activities";
import { getMaxHealth, getXpForNextLevel } from "@/lib/creatureUtils";
import { formatInt } from "@/lib/format";
import { Context, getFromOptionalFunc, Id } from "@/lib/utilTypes";
import { useState } from "react";
import { AdventurerDisplay } from "../AdventurerDisplay";
import {
  getMaxRosterSize,
  getRecruitmentCost,
  recruitAdventurer,
} from "@/lib/gameUtils";
import ItemList from "../ItemList";
import { hasInInventory } from "@/lib/inventory";

export default function RosterMenu({ context }: { context: Context }) {
  const [selectedId, setSelectedId] = useState<Id>();

  const recruitmentCost = getRecruitmentCost(context.game);

  function recruit() {
    recruitAdventurer(context.game);
    context.updateGameState();
  }

  return (
    <div>
      <h1>
        Roster ({Object.keys(context.game.roster).length}/
        {getMaxRosterSize(context.game)})
      </h1>
      <div className="flex">
        <div className="flex flex-col overflow-y-scroll">
          {Object.keys(context.game.roster).length <
            getMaxRosterSize(context.game) && (
            <button
              onClick={recruit}
              disabled={
                !hasInInventory(context.game.inventory, recruitmentCost)
              }
            >
              Recruit Adventurer{" "}
              <ItemList items={recruitmentCost} context={context} />
            </button>
          )}
          {Object.values(context.game.roster).map((creature) => {
            const xpForNextLevel = getXpForNextLevel(creature.level);

            return (
              <button
                key={String(creature.id)}
                onClick={() => setSelectedId(creature.id)}
              >
                {creature.name} (HP: {formatInt(creature.hp)}/
                {formatInt(getMaxHealth(creature, context.game))}, XP:{" "}
                <span
                  className={
                    creature.xp >= xpForNextLevel
                      ? "font-bold text-green-600"
                      : ""
                  }
                >
                  {formatInt(creature.xp)}/{formatInt(xpForNextLevel)}
                </span>
                ) -{" "}
                {getFromOptionalFunc(
                  activities[creature.activity.definitionId].description,
                  creature,
                  context.game
                )}
              </button>
            );
          })}
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
