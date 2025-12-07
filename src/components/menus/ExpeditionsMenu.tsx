import ExpeditionDisplay from "../ExpeditionDisplay";
import { useState } from "react";
import StartExpeditionMenu from "./StartExpeditionMenu";
import { Context } from "@/lib/utilTypes";
import { getMaxExpeditions } from "@/lib/gameUtils";

export default function ExpeditionsMenu({ context }: { context: Context }) {
  const [creatingExpedition, setCreatingExpedition] = useState(false);

  const maxExpeditions = getMaxExpeditions(context.game);

  return (
    <div>
      <h1>
        Expeditions ({context.game.expeditions.length}/{maxExpeditions})
      </h1>
      {context.game.expeditions.length < maxExpeditions && (
        <button onClick={() => setCreatingExpedition(!creatingExpedition)}>
          {creatingExpedition ? "Cancel" : "Create Expedition"}
        </button>
      )}
      {creatingExpedition &&
      context.game.expeditions.length < maxExpeditions ? (
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
