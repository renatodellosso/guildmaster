export type TableEntry<T> = {
  weight: number;
  item: T;
};

export class Table<T> {
  items: TableEntry<T>[];
  private totalWeight: number;

  constructor(items: TableEntry<T>[]) {
    this.items = items;
    this.totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
  }

  roll(): T {
    const roll = Math.random() * this.totalWeight;
    let cumulativeWeight = 0;

    for (const TableEntry of this.items) {
      cumulativeWeight += TableEntry.weight;
      if (roll < cumulativeWeight) {
        return TableEntry.item;
      }
    }

    // Fallback, should not reach here
    return this.items[this.items.length - 1].item;
  }

  rollMultiple(count: number): T[] {
    const results: T[] = [];
    for (let i = 0; i < count; i++) {
      results.push(this.roll());
    }
    return results;
  }
}
