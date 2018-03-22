import { increaseMoves, taunt, tauntDisabler } from "./effects/fabric";
import { EffectImpact, EffectTargetingScope } from "../index";
import { UnitTypes } from "../index";

export default {
  [UnitTypes.Pawn]: {
    type: UnitTypes.Pawn,
    name: "Pawn",
    cost: 1,
    health: 6,
    attack: 1,
    moves: 0,
    availability: 0,
    effects: [increaseMoves(1)]
  },

  [UnitTypes.Officer]: {
    type: UnitTypes.Officer,
    name: "Officer",
    cost: 2,
    health: 6,
    attack: 2,
    moves: 0,
    availability: 0,
    effects: [taunt()]
  },

  [UnitTypes.Horse]: {
    type: UnitTypes.Horse,
    name: "Horse",
    cost: 3,
    health: 5,
    attack: 3,
    moves: 0,
    availability: 0,
    effects: [tauntDisabler()]
  }
};
