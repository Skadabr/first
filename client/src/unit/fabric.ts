import flatMap from "lodash.flatmap";

import { UnitTypes } from "../constants";
import { UnitBasicCharacteristic } from ".";

export default function createUnit(type: UnitTypes) {
  switch (type) {
    case UnitTypes.Pawn:
      return {
        ...UnitBasicCharacteristic[UnitTypes.Pawn],
      };

    case UnitTypes.Officer:
      return {
        ...UnitBasicCharacteristic[UnitTypes.Officer],
      };
  }
}
