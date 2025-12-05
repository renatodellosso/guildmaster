import { classes, ClassId } from "@/lib/content/classes";
import { AdventurerInstance } from "@/lib/creature";
import { getSkill } from "@/lib/creatureUtils";
import { SkillId } from "@/lib/skills";
import { getFromOptionalFunc, Context } from "@/lib/utilTypes";
import { useState } from "react";
import ClassTooltip from "../ClassTooltip";
import { formatInt } from "@/lib/format";

export function LevelUpMenu({
  adventurer,
  close,
  context,
}: {
  adventurer: AdventurerInstance;
  close: () => void;
  context: Context;
}) {
  const availableClasses = Object.values(classes).filter((cls) =>
    getFromOptionalFunc(cls.canSelect, adventurer, context.game)
  );

  const [errorMessage, setErrorMessage] = useState<string>();
  const [skill, setSkill] = useState<SkillId>(SkillId.Melee);
  const [selectedClass, setSelectedClass] = useState<ClassId>(
    availableClasses[0]?.id
  );

  function levelUp() {
    if (!skill || (!selectedClass && availableClasses.length > 0)) {
      setErrorMessage("Please select a skill and class to level up.");
      return;
    }

    adventurer.level += 1;

    // Increase selected skill by 1
    const currentSkillValue = getSkill(skill, adventurer, context.game);
    if (!adventurer.skills) {
      adventurer.skills = {};
    }
    adventurer.skills[skill] = currentSkillValue + 1;

    // Add selected class
    if (selectedClass) {
      if (!adventurer.classes[selectedClass]) {
        adventurer.classes[selectedClass] = 0;
      }
      adventurer.classes[selectedClass]!++;
    }

    close();
  }

  return (
    <div className="flex flex-col gap-1">
      <div className="flex gap-1">
        <button onClick={close}>Back</button>
        <h2>
          Leveling {adventurer.name} up to level {adventurer.level + 1}
        </h2>
      </div>
      <div className="flex gap-2">
        <p>Select a skill to increase by 1:</p>
        <select
          value={skill}
          onChange={(e) => setSkill(e.target.value as SkillId)}
        >
          {Object.keys(SkillId).map((skill) => (
            <option key={skill} value={skill}>
              {skill} (
              {formatInt(getSkill(skill as SkillId, adventurer, context.game))}{" "}
              &rarr;{" "}
              {formatInt(
                getSkill(skill as SkillId, adventurer, context.game) + 1
              )}
              )
            </option>
          ))}
        </select>
      </div>
      {availableClasses.length > 0 && (
        <div className="flex gap-2">
          <p>Select a class to add:</p>
          <ClassTooltip
            classId={selectedClass!}
            creature={adventurer}
            context={context}
            level={(adventurer.classes[selectedClass!] || 0) + 1}
          >
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value as ClassId)}
            >
              {availableClasses.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.name}
                </option>
              ))}
            </select>
          </ClassTooltip>
        </div>
      )}
      <button onClick={levelUp}>Confirm</button>
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
    </div>
  );
}
