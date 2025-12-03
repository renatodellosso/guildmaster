import { MainRegistryContext } from "@/lib/content/mainRegistryContext";
import { CreatureInstance } from "@/lib/creature";
import { createExpedition } from "@/lib/expedition";
import { getMaxPartySize } from "@/lib/gameStats";
import { RegistryToDungeonId } from "@/lib/registry";
import { Context, Id } from "@/lib/utilTypes";
import { useState } from "react";

export default function StartExpeditionMenu({
  context,
  onStartExpedition,
}: {
  context: Context;
  onStartExpedition: () => void;
}) {
  const [dungeonId, setDungeonId] =
    useState<RegistryToDungeonId<MainRegistryContext>>();
  const [error, setError] = useState<string>();
  const [party, setParty] = useState<Id[]>([]);

  const availablePartyMembers = Object.values(context.game.roster).filter(
    (member) => member.hp > 0 && !party.includes(member.id)
  );

  const maxPartySize = getMaxPartySize(context.game, context.registry);

  function start() {
    if (!dungeonId) {
      setError("No dungeon selected");
      return;
    }
    const dungeon = context.registry.dungeons[dungeonId];
    if (!dungeon) {
      setError("Invalid dungeon selected");
      return;
    }

    if (party.length === 0) {
      setError("No party members selected");
      return;
    }

    if (party.length > maxPartySize) {
      setError(`Party size cannot exceed ${maxPartySize}`);
      return;
    }

    context.game.expeditions.push(
      createExpedition(dungeonId, party, context.registry)
    );
    context.updateGameState();

    onStartExpedition();
  }

  return (
    <div>
      <h2>Start Expedition</h2>
      <div className="flex gap-1">
        <p>Dungeon:</p>
        <select
          onChange={(e) => setDungeonId(e.target.value as typeof dungeonId)}
        >
          <option value="">Select a dungeon</option>
          {Object.values(context.registry.dungeons).map((dungeon, index) => (
            <option key={index} value={String(dungeon.id)}>
              {dungeon.name}
            </option>
          ))}
        </select>
      </div>
      <div className="flex flex-col gap-1 mb-2">
        <p>Party:</p>
        {party.length < maxPartySize && (
          <PartyMemberSelector
            availableMembers={availablePartyMembers}
            currentText={"Add to front"}
            onChange={(newSelected) => {
              setParty([newSelected, ...party]);
            }}
          />
        )}
        {party.map((memberId) => (
          <PartyMemberSelector
            key={String(memberId)}
            availableMembers={availablePartyMembers}
            currentText={context.game.roster[memberId].name}
            onChange={(newSelected) => {
              setParty(party.map((id) => (id === memberId ? newSelected : id)));
            }}
          />
        ))}
        {party.length >= 1 && party.length < maxPartySize && (
          <PartyMemberSelector
            availableMembers={availablePartyMembers}
            currentText={"Add to back"}
            onChange={(newSelected) => {
              setParty([...party, newSelected]);
            }}
          />
        )}
      </div>
      <button onClick={start}>Start Expedition</button>
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}

function PartyMemberSelector({
  availableMembers,
  currentText,
  onChange,
}: {
  availableMembers: CreatureInstance<MainRegistryContext>[];
  currentText: string;
  onChange: (newSelected: Id) => void;
}) {
  return (
    <select
      onChange={(e) => {
        const selectedName = e.target.value;
        const selected = availableMembers.find(
          (member) => member.name === selectedName
        );

        if (!selected) {
          throw new Error("Selected member not found");
        }

        onChange(selected.id);
      }}
      defaultValue={"current"}
    >
      <option value={"current"}>{currentText}</option>
      {availableMembers.map((member) => (
        <option key={String(member.id)} value={member.name}>
          {member.name}
        </option>
      ))}
    </select>
  );
}
