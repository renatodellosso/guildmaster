import { CreatureDefId, creatures } from "@/lib/content/creatures";
import { Context } from "@/lib/utilTypes";
import { useState } from "react";
import CreatureDetails from "../CreatureDetails";
import { createCreatureInstance } from "@/lib/creature";

export default function CreaturesCodex({ context }: { context: Context }) {
  const [creatureId, setCreatureId] = useState<CreatureDefId>();
  return (
    <div className="flex">
      <div className="flex flex-col">
        {Object.values(creatures).map((creature) => (
          <button
            key={creature.id}
            onClick={() => setCreatureId(creature.id)}
            className={`text-left ${
              creatureId === creature.id ? "underline" : ""
            }`}
          >
            {creature.name}
          </button>
        ))}
      </div>
      {!creatureId ? (
        <div className="grow flex justify-center items-center">
          <p>Select a creature to view details</p>
        </div>
      ) : (
        <div className="m-2">
          <CreatureDetails
            creature={createCreatureInstance(creatureId, context.game)}
            context={context}
          />
        </div>
      )}
    </div>
  );
}
