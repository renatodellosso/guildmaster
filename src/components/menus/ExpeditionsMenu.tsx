import ExpeditionDisplay from "../ExpeditionDisplay";
import { useState } from "react";
import StartExpeditionMenu from "./StartExpeditionMenu";
import { Context } from "@/lib/utilTypes";

export default function ExpeditionsMenu({ context }: { context: Context }) {
  const [creatingExpedition, setCreatingExpedition] = useState(false);

  return (
    <div>
      <h1>Expeditions</h1>
      <button onClick={() => setCreatingExpedition(!creatingExpedition)}>
        {creatingExpedition ? "Cancel" : "Create Expedition"}
      </button>
      {creatingExpedition ? (
        <StartExpeditionMenu
          context={context}
          onStartExpedition={() => setCreatingExpedition(false)}
        />
      ) : (
        context.game.expeditions.map((expedition, index) => (
          <ExpeditionDisplay
            key={index}
            expedition={expedition}
            context={context}
          />
        ))
      )}
    </div>
  );
}
