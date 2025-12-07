export enum DamageType {
  Slashing = "slashing",
  Piercing = "piercing",
  Bludgeoning = "bludgeoning",
  Fire = "fire",
  Cold = "cold",
  Lightning = "lightning",
  Poison = "poison",
  Psychic = "psychic",
  Necrotic = "necrotic",
  Radiant = "radiant",
  Force = "force",
  Thunder = "thunder",
}

export enum DamageTypeGroups {
  All = "all",
  Physical = "physical",
  Elemental = "elemental",
  Magical = "magical",
}

export type DamageTypeOrGroup = DamageType | DamageTypeGroups;

export type Damage = {
  amount: number;
  type: DamageType;
};

export function mergeDamages(damages: Damage[]): Damage[] {
  const merged: { [key in DamageType]?: number } = {};

  for (const damage of damages) {
    if (!merged[damage.type]) {
      merged[damage.type] = 0;
    }
    merged[damage.type]! += damage.amount;
  }

  return Object.entries(merged).map(([type, amount]) => ({
    type: type as DamageType,
    amount,
  }));
}

export type DamageResistances = {
  [key in DamageTypeOrGroup]?: number;
};

export function mergeResistances(
  resistancesList: DamageResistances[]
): DamageResistances {
  const merged: DamageResistances = {};

  // Calculate combined multipliers. Start at 1 (no resistance)
  for (const resistances of resistancesList) {
    for (const [type, amount] of Object.entries(resistances)) {
      if (!merged[type as DamageTypeOrGroup]) {
        merged[type as DamageTypeOrGroup] = 1;
      }
      merged[type as DamageTypeOrGroup]! *= 1 - amount;
    }
  }

  // Convert back to resistance amounts
  for (const type in merged) {
    merged[type as DamageTypeOrGroup] = 1 - merged[type as DamageTypeOrGroup]!;
  }

  return merged;
}

export function getDamageAfterResistances(
  damages: Damage[],
  resistances: DamageResistances
): Damage[] {
  return damages.map((damage) => {
    let finalAmount = damage.amount;
    for (const [resistanceType, resistanceAmount] of Object.entries(
      resistances
    )) {
      if (matchesDamageType(damage.type, resistanceType as DamageTypeOrGroup)) {
        finalAmount *= 1 - resistanceAmount;
      }
    }
    return {
      type: damage.type,
      amount: finalAmount,
    };
  });
}

export function matchesDamageType(
  damageType: DamageType,
  filterType: DamageTypeOrGroup
): boolean {
  if (filterType === DamageTypeGroups.All) {
    return true;
  }

  if (damageType === filterType) {
    return true;
  }

  switch (filterType) {
    case DamageTypeGroups.Physical:
      return (
        damageType === DamageType.Slashing ||
        damageType === DamageType.Piercing ||
        damageType === DamageType.Bludgeoning
      );
    case DamageTypeGroups.Elemental:
      return (
        damageType === DamageType.Fire ||
        damageType === DamageType.Cold ||
        damageType === DamageType.Lightning ||
        damageType === DamageType.Poison ||
        damageType === DamageType.Thunder
      );
    case DamageTypeGroups.Magical:
      return (
        damageType === DamageType.Psychic ||
        damageType === DamageType.Necrotic ||
        damageType === DamageType.Radiant ||
        damageType === DamageType.Force
      );
    default:
      return false;
  }
}

export function removeNonPositiveDamages(damages: Damage[]): Damage[] {
  return damages.filter((damage) => damage.amount > 0);
}

export function subtractDamage(
  damages: Damage[],
  damageToSubtract: Damage[]
): Damage[] {
  const result: Damage[] = [];

  for (const damage of damages) {
    const subtractAmount =
      damageToSubtract
        .filter((d) => matchesDamageType(damage.type, d.type))
        .reduce((sum, d) => sum + d.amount, 0) || 0;

    const newAmount = damage.amount - subtractAmount;
    if (newAmount > 0) {
      result.push({
        type: damage.type,
        amount: newAmount,
      });
    }
  }

  return result;
}
