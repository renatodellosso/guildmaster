import { RetreatTriggerDefinition } from "./combat";
import { CreatureDefinition } from "./creature";
import { DungeonDefinition } from "./dungeon";
import { Id } from "./utilTypes";

export type Registry<TId extends Id, TItem> = {
  [key in TId]: TItem;
};

export type RawRegistry<TId extends Id, TItem> = {
  [key in TId]: Omit<TItem, "id">;
};

export type RegistryContext<
  TCreatureId extends Id = Id,
  TRetreatTriggerId extends Id = Id,
  TDungeonId extends Id = Id,
> = {
  creatures: Registry<
    TCreatureId,
    CreatureDefinition<
      RegistryContext<TCreatureId, TRetreatTriggerId, TDungeonId>
    >
  >;
  retreatTriggers: Registry<
    TRetreatTriggerId,
    RetreatTriggerDefinition<
      RegistryContext<TCreatureId, TRetreatTriggerId, TDungeonId>
    >
  >;
  dungeons: Registry<
    TDungeonId,
    DungeonDefinition<
      RegistryContext<TCreatureId, TRetreatTriggerId, TDungeonId>
    >
  >;
};

export type RegistryToCreatureId<TRegistryContext extends RegistryContext> =
  TRegistryContext["creatures"] extends Record<infer TDefId, unknown>
    ? TDefId
    : Id;

export type RegistryToRetreatTriggerId<
  TRegistryContext extends RegistryContext,
> =
  TRegistryContext["retreatTriggers"] extends Record<infer TDefId, unknown>
    ? TDefId
    : Id;

export type RegistryToDungeonId<TRegistryContext extends RegistryContext> =
  TRegistryContext["dungeons"] extends Record<infer TDefId, unknown>
    ? TDefId
    : Id;

export function finishRegistry<TId extends Id, TItem extends { id: TId }>(
  rawRegistry: RawRegistry<TId, TItem>,
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
