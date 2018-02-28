import flatMap from "lodash.flatmap";

import { generateID } from "../../utils/common";
import { UnitTypes } from "../../constants";
import { UnitCharacteristic } from ".";

export default function createUnit(type: UnitTypes, owner_id) {
  const unit_id = generateID();

  const characteristics = UnitCharacteristic[type].map(
    parametrizeEffectsWithUnitId
  );

  return {
    type,
    owner_id,
    ...characteristics
  };

  function parametrizeEffectsWithUnitId(unit) {
    const effects = unit.effects.map(eff => ({ ...eff, unit_id }));
    return { ...unit, effects };
  }
}
