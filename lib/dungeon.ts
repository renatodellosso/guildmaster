import { CreatureDefId } from "./content/creatures";
import { DungeonId } from "./content/dungeons";
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
