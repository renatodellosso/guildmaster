import {
  RegistryContext,
  RegistryToCreatureId,
  RegistryToDungeonId,
} from "./registry";
import { Table } from "./table";

export type DungeonDefinition<TRegistryContext extends RegistryContext> = {
  id: RegistryToDungeonId<TRegistryContext>;
  name: string;
  encounters: Table<Encounter<TRegistryContext>>;
};

export type Encounter<TRegistryContext extends RegistryContext> = {
  id: RegistryToCreatureId<TRegistryContext>;
  count: number;
}[];
