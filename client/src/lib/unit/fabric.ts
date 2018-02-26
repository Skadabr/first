import flatMap from "lodash.flatmap";

import { UnitTypes } from "../../constants";
import { UnitCharacteristic } from ".";

export default function createUnit(type: UnitTypes, opts) {
  const {
    //  stateEffects = [],
    //  globalStateEffects = [],
    //  targetEffects = [],
    //  globalTargetEffects = [],
    unitEffects = [],
    owner_id
  } = opts;

  const effects = [...unitEffects, ...UnitCharacteristic[type].effects];

  switch (type) {
    case UnitTypes.Pawn:
      return {
        owner_id,
        _id: Math.random().toString(),
        ...UnitCharacteristic[UnitTypes.Pawn],
        effects
      };

    case UnitTypes.Officer:
      return {
        owner_id,
        _id: Math.random().toString(),
        ...UnitCharacteristic[UnitTypes.Officer],
        effects
      };
  }
}
