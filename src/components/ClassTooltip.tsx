import { ClassId } from "@/lib/content/classes";
import { CreatureInstance } from "@/lib/creature";
import { Context } from "@/lib/utilTypes";
import { ReactNode } from "react";
import { Tooltip } from "./Tooltip";
import ClassDetails from "./ClassDetails";

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

  const classLevel = level || creature.classes[classId] || 1;

  const tooltip = (
    <ClassDetails
      classId={classId}
      creature={creature}
      context={context}
      level={classLevel}
    />
  );

  return <Tooltip content={tooltip}>{children}</Tooltip>;
}
