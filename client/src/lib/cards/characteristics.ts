import { UnitTypes } from "../../constants";
import { makeUnitAvailableEffect } from "./effects";

export default {
  [UnitTypes.Pawn]: {
    type: UnitTypes.Pawn,
    effects: []
  },

  [UnitTypes.Officer]: {
    type: UnitTypes.Officer,
    effects: [makeUnitAvailableEffect()]
  }
};
