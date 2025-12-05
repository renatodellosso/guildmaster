import { classes, ClassId } from "@/lib/content/classes";
import { CreatureInstance } from "@/lib/creature";
import { Context, getFromOptionalFunc } from "@/lib/utilTypes";
import { ReactNode } from "react";
import { Tooltip } from "./Tooltip";
import CreatureProviderDetails from "./CreatureProviderDetails";

export default function ClassTooltip({
  classId,
  creature,
  level,
  context,
  children,
}: {
  classId: ClassId;
  creature: CreatureInstance;
  context: Context;
  level: number;
  children: ReactNode;
}) {
  if (!classId) {
    return <>{children}</>;
  }

  const cls = classes[classId];
  const classLevel = level || creature.classes[classId] || 1;

  const tooltip = (
    <>
      <strong>
        {cls.name} {classLevel}
      </strong>
      <p>
        {getFromOptionalFunc(
          cls.description,
          creature,
          context.game,
          classLevel
        )}
      </p>
      <CreatureProviderDetails
        provider={cls}
        source={classLevel}
        creature={creature}
        context={context}
      />
    </>
  );

  return <Tooltip content={tooltip}>{children}</Tooltip>;
}
