export function createNumberSequence(n) {
  const res = [];
  for (let i = 0; i < n; i++) res.push(i);
  return res;
}

export function generateID() {
  return Math.random().toString();
}

export class UnitSet {
  private units: any[];

  constructor() {
    this.units = []
  }

  add(unit) {
    this.units = [...this.units.filter(unit._id), unit];
  }

  toArray() {
    return this.units;
  }
}
