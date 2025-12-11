import { CreatureDefId } from "./content/creatures";
import { DungeonId, dungeons } from "./content/dungeons";
import { Table } from "./table";

export type DungeonDefinition = {
  id: DungeonId;
  name: string;
  encounters: Table<Encounter>;
};

export type Encounter = {
  id: CreatureDefId;
  count: number;
}[];

export function getCreaturesInDungeon(
  dungeonId: DungeonId
): Set<CreatureDefId> {
  const dungeon = dungeons[dungeonId];
  const creatureSet = new Set<CreatureDefId>();

  for (const encounter of dungeon.encounters.items) {
    for (const creature of encounter.item) {
      creatureSet.add(creature.id);
    }
  }

  return creatureSet;
}
