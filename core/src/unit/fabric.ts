import { generateID } from "../utils";
import { UnitTypes } from "../index";
import { characteristics } from "./index";

export default function createUnit(type: UnitTypes, owner_id) {
  const unit_id = generateID();
  const charachteristic = characteristics[type] as any;

  return {
    type,
    _id: unit_id,
    owner_id,
    ...charachteristic,
    effects: charachteristic.effects.map(eff => ({ ...eff, unit_id }))
  };
}
