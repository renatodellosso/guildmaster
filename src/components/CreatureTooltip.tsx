import { CreatureInstance } from "@/lib/creature";
import { Context } from "@/lib/utilTypes";
import { ReactNode } from "react";
import { Tooltip } from "./Tooltip";
import CreatureDetails from "./CreatureDetails";

export default function CreatureTooltip({
  creature,
  context,
  children,
}: {
  creature: CreatureInstance;
  context: Context;
  children: ReactNode;
}) {
  return (
    <Tooltip
      content={<CreatureDetails creature={creature} context={context} />}
    >
      {children}
    </Tooltip>
  );
}
