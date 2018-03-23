import { generateID } from "../utils";
import { UnitTypes } from "../index";
import { characteristics } from "./index";

export default function createUnit(type: UnitTypes, ownerId) {
  const _id = generateID();
  const charachteristic = characteristics[type] as any;

  return {
    type,
    _id,
    ownerId,
    ...charachteristic,
    effects: charachteristic.effects.map(eff => ({ ...eff, _id }))
  };
}
