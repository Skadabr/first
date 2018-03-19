import { CLEAN_STATE } from "../index";
import battleReducer from "./battle";
import availableTargetsReducer from "./targets";

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
} from "../../../client/src/actions/user";

export {
  loadUsers,
  usersUpsert,
  usersLoad,
  usersRemove,
  default as usersReducer
} from "../../../client/src/actions/users";

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
