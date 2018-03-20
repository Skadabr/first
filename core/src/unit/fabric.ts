import { generateID } from "../utils";
import { UnitTypes } from "../index";
import { characteristics } from "./index";

export default function createUnit(type: UnitTypes, ownerId) {
  const unitId = generateID();
  const charachteristic = characteristics[type] as any;

  return {
    type,
    _id: unitId,
    ownerId,
    ...charachteristic,
    effects: charachteristic.effects.map(eff => ({ ...eff, unitId }))
  };
}
