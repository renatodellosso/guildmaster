import { OfficesData } from "@/lib/building";
import { classes, ClassId } from "@/lib/content/classes";
import { AdventurerInstance } from "@/lib/creature";
import { getSkill } from "@/lib/creatureUtils";
import { SkillId } from "@/lib/skills";
import { Context, getFromOptionalFunc } from "@/lib/utilTypes";

export default function AutoLevelConfig({
  adventurer,
  context,
}: {
  adventurer: AdventurerInstance;
  context: Context;
}) {
  const autoLevelData = context.game.buildings["offices"]?.data as
    | OfficesData
    | undefined;

  const enabled = adventurer.id in (autoLevelData?.autolevelAdventurers || {});

  const availableClasses = Object.values(classes).filter((cls) =>
    getFromOptionalFunc(cls.canSelect, adventurer, context.game)
  );

  const highestSkill = Object.values(SkillId).reduce(
    (maxSkill, currentSkill) => {
      return getSkill(currentSkill, adventurer, context.game) >
        getSkill(maxSkill, adventurer, context.game)
        ? currentSkill
        : maxSkill;
    },
    SkillId.Melee
  );
  const highestClass = Object.keys(adventurer.classes)
    .filter((cls) => availableClasses.some((ac) => ac.id === cls))
    .reduce((maxClass, currentClass) => {
      return (adventurer.classes[currentClass as ClassId] || 0) >
        (adventurer.classes[maxClass as ClassId] || 0)
        ? currentClass
        : maxClass;
    }, availableClasses[0]?.id) as ClassId | undefined;

  return (
    <div className="flex flex-col w-1/5">
      <strong>Autolevel Config</strong>
      {enabled ? (
        <>
          <button
            onClick={() => {
              delete autoLevelData!.autolevelAdventurers[adventurer.id];
              context.updateGameState();
            }}
          >
            Disable Autolevel
          </button>
          <div className="flex gap-2">
            <label>Class:</label>
            <select
              value={
                autoLevelData!.autolevelAdventurers[adventurer.id].classId || ""
              }
              onChange={(e) => {
                const classId = e.target.value || undefined;
                autoLevelData!.autolevelAdventurers[adventurer.id].classId =
                  classId as ClassId | undefined;
                context.updateGameState();
              }}
            >
              <option value={undefined}>None</option>
              {availableClasses.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex gap-2">
            <label>Skill:</label>
            <select
              value={autoLevelData!.autolevelAdventurers[adventurer.id].skillId}
              onChange={(e) => {
                const skillId = e.target.value as SkillId;
                autoLevelData!.autolevelAdventurers[adventurer.id].skillId =
                  skillId;
                context.updateGameState();
              }}
            >
              {Object.keys(SkillId).map((skill) => (
                <option key={skill} value={skill}>
                  {skill}
                </option>
              ))}
            </select>
          </div>
        </>
      ) : (
        <button
          onClick={() => {
            if (!autoLevelData) {
              context.game.buildings["offices"]!.data = {
                autolevelAdventurers: {},
              };
            }
            (
              context.game.buildings["offices"]?.data as OfficesData
            ).autolevelAdventurers[adventurer.id] = {
              classId: highestClass,
              skillId: highestSkill,
            };
            context.updateGameState();
          }}
        >
          Enable Autolevel
        </button>
      )}
    </div>
  );
}
