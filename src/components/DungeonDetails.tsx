import { DungeonId, dungeons } from "@/lib/content/dungeons";
import { getCreaturesInDungeon } from "@/lib/dungeon";
import { Context } from "@/lib/utilTypes";
import CreatureTooltip from "./CreatureTooltip";
import { creatures } from "@/lib/content/creatures";
import { createCreatureInstance } from "@/lib/creature";

export default function DungeonDetails({
  dungeonId,
  context,
}: {
  dungeonId: DungeonId;
  context: Context;
}) {
  const dungeon = dungeons[dungeonId];

  return (
    <div>
      <h1>{dungeon.name}</h1>
      <strong>Creatures:</strong>
      <ul>
        {Array.from(getCreaturesInDungeon(dungeonId)).map((creatureId) => (
          <li key={creatureId}>
            <CreatureTooltip
              creature={createCreatureInstance(creatureId, context.game)}
              context={context}
            >
              {creatures[creatureId].name}
            </CreatureTooltip>
          </li>
        ))}
      </ul>
    </div>
  );
}
