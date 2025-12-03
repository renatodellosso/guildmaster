import { Id } from "./utilTypes";

export type Registry<TId extends Id, TItem> = {
  [key in TId]: TItem;
};

export type RawRegistry<TId extends Id, TItem> = {
  [key in TId]: Omit<TItem, "id">;
};

export function finishRegistry<TId extends Id, TItem extends { id: TId }>(
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
