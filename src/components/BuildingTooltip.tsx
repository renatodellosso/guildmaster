import { BuildingInstance } from "@/lib/building";
import { BuildingId, buildings } from "@/lib/content/buildings";
import { Context, getFromOptionalFunc } from "@/lib/utilTypes";
import { ReactNode } from "react";
import { Tooltip } from "./Tooltip";
import CreatureProviderDetails from "./CreatureProviderDetails";
import GameProviderDetails from "./GameProviderDetails";

export default function BuildingTooltip({
  building,
  context,
  children,
}: {
  building: BuildingInstance | BuildingId;
  context: Context;
  children: ReactNode;
}) {
  const def =
    buildings[typeof building === "string" ? building : building.definitionId];
  const source = typeof building === "string" ? undefined : building;

  const tooltip = (
    <>
      <strong>{def.name}</strong>
      {getFromOptionalFunc(def.description, source, context.game)}
      <CreatureProviderDetails
        provider={def}
        source={source}
        creature={undefined}
        context={context}
      />
      <GameProviderDetails provider={def} source={source} context={context} />
    </>
  );

  return <Tooltip content={tooltip}>{children}</Tooltip>;
}
