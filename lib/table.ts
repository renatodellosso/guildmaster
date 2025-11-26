type TableItem<T> = {
  weight: number;
  item: T;
};

export class Table<T> {
  private items: TableItem<T>[];
  private totalWeight: number;

  constructor(items: TableItem<T>[]) {
    this.items = items;
    this.totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
  }

  roll(): T {
    const roll = Math.random() * this.totalWeight;
    let cumulativeWeight = 0;

    for (const tableItem of this.items) {
      cumulativeWeight += tableItem.weight;
      if (roll < cumulativeWeight) {
        return tableItem.item;
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
