import { combineReducers } from "redux";

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
  unitAttack,
  unitDecreaseAvailability,
  unitDecreaseMoves,
  unitIncreaseMoves,
  unitSetMoves,
  unitSetAvailability
} from "./battle/unit";
export {
  battleUpdate,
  battleNextTurn,
  default as battleReducer
} from "./battle/index";

export {
  userAdd,
  userDecreaseRate,
  userIncreaseRate,
  userUpdateStatus,
  default as userReducer
} from "./user";

export {
  loadUsers,
  usersUpsert,
  usersLoad,
  usersRemove,
  default as usersReducer
} from "./users";

export {
  availableTargetsUpdate,
  default as availableTargetsReducer
} from "./targets";
