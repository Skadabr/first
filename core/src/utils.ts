export class UnitSet {
  private units: any[];

  constructor() {
    this.units = [];
  }

  add(unit) {
    this.units = [...this.units.filter(unit._id), unit];
  }

  toArray() {
    return this.units;
  }
}

export function createNumberSequence(n: number): number[] {
  const res: number[] = [];
  for (let i = 0; i < n; i++) res.push(i);
  return res;
}

export function generateID() {
  return Math.random().toString();
}

export function createUniqueArray(arr) {
  return [...new Set(arr)];
}
