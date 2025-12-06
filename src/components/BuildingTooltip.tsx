import { BuildingInstance } from "@/lib/building";
import { BuildingId, buildings } from "@/lib/content/buildings";
import { Context } from "@/lib/utilTypes";
import { ReactNode } from "react";
import { Tooltip } from "./Tooltip";
import CreatureProviderDetails from "./CreatureProviderDetails";

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

  const tooltip = (
    <>
      <strong>{def.name}</strong>
      <CreatureProviderDetails
        provider={def}
        source={typeof building === "string" ? undefined : building}
        creature={undefined}
        context={context}
      />
    </>
  );

  return <Tooltip content={tooltip}>{children}</Tooltip>;
}
