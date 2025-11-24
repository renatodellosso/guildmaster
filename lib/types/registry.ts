import { CreatureDefinition } from "./creature";

export type Registry<TId extends string, TItem> = {
  [key in TId]: TItem;
};

export type RawRegistry<TId extends string, TItem> = {
  [key in TId]: Omit<TItem, "id">;
};

export type RegistryContext<TCreatureId extends string = string> = {
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
