import { CreatureDefinition } from "./creature";
import { Id } from "./utilTypes";

export type Registry<TId extends Id, TItem> = {
  [key in TId]: TItem;
};

export type RawRegistry<TId extends Id, TItem> = {
  [key in TId]: Omit<TItem, "id">;
};

export type RegistryContext<TCreatureId extends Id = Id> = {
  creatures: Registry<
    TCreatureId,
    CreatureDefinition<RegistryContext<TCreatureId>>
  >;
};

export function finishRegistry<TId extends string, TItem extends { id: TId }>(
  rawRegistry: RawRegistry<TId, TItem>
): Registry<TId, TItem> {
  const finishedRegistry = {} as Registry<TId, TItem>;

  for (const id in rawRegistry) {
    finishedRegistry[id as TId] = {
      id: id as TId,
      ...(rawRegistry[id as TId] as Omit<TItem, "id">),
    } as TItem;
  }

  return finishedRegistry;
}
