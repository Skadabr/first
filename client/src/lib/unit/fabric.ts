import flatMap from "lodash.flatmap";

import { generateID } from "../../utils/common";
import { UnitTypes } from "../../constants";
import { UnitCharacteristic } from ".";

export default function createUnit(type: UnitTypes, owner_id) {
  const unit_id = generateID();
  const charachteristics = UnitCharacteristic[type] as any;

  return {
    type,
    _id: unit_id,
    owner_id,
    ...charachteristics,
    effects: charachteristics.effects.map(eff => ({ ...eff, unit_id }))
  };
}
