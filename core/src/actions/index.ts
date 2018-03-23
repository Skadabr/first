import { CLEAN_STATE } from "../index";

const EMPTY = {};

export {
  playerAddCards,
  playerRemoveCard,
  playerAddUnit,
  playerRemoveUnit,
  playerDecreseMoney,
  playerAdjustMoney
} from "./battle/player";
export {
  unitDecreaseHealth,
  unitDecreaseMoves,
  unitIncreaseMoves,
  unitAddEffect,
  unitSetMoves,
} from "./battle/unit";
export { battleUpdate, battleNextTurn } from "./battle/index";

export { availableTargetsUpdate } from "./targets";

import availableTargetsReducer from "./targets";
import battleReducer from "./battle/index";

export function reducer(state = EMPTY as any, action) {
  return {
    battle: battleReducer(state.battle, action),
    availableTargets: availableTargetsReducer(state.availableTargets, action),
    user: state.user
  };
}
