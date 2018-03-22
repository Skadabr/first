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
  unitActivate,
  unitDisActivate,
  unitDecreaseHealth,
  unitDecreaseAvailability,
  unitDecreaseMoves,
  unitIncreaseMoves,
  unitAddEffect,
  unitSetMoves,
  unitSetAvailability
} from "./battle/unit";
export {
  battleUpdate,
  battleNextTurn,
  default as battleReducer
} from "./battle/index";


export {
  availableTargetsUpdate,
  default as availableTargetsReducer
} from "./targets";

export function reducer(state = EMPTY as any, action) {
  return {
    battle: battleReducer(state.battle, action),
    availableTargets: availableTargetsReducer(state.availableTargets, action),
    user: state.user
  };
}
