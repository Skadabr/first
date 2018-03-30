import IO from "../socket";
import { userUpdateStatus } from "./user";
import { BattleEngine, UserStatusType } from "core";
import { battleUpdate } from "./battle";
import { handleBattleError, handleBattleEvent } from "../lib/battle";

//
// ============ Actions ============
//

export function startBattle(val, router) {
  return dispatch => {
    const { data, error } = val;
    // if (error) ????;

    dispatch(userUpdateStatus(UserStatusType.Fight));
    dispatch(battleUpdate(data.battle));
    router.history.push("/user/battle");
  };
}

export function playCard(cardId: string, position: number) {
  return (dispatch, getState) => {
    createBattleEngine(getState(), dispatch, battleEngine => {
      battleEngine.playCard(cardId, position);
    });
    IO().gameIO.playCard(cardId, position);
  };
}

export function onTurn() {
  return () => {
    IO().gameIO.passTheTurn();
  };
}

export function attack(data: { sourceId: string; targetId: string }) {
  return (dispatch, getState) => {
    createBattleEngine(getState(), dispatch, battleEngine => {
      battleEngine.attack(data.sourceId, data.targetId);
    });
    IO().gameIO.attack(data);
  };
}
//
// ============ helpers ============
//

function createBattleEngine(state, dispatch, fn: (b: BattleEngine) => void) {
  const battleEngine = new BattleEngine(state.battle, state.user);

  battleEngine.on(BattleEngine.BATTLE_EVENT, handleBattleEvent(dispatch));
  battleEngine.on(BattleEngine.BATTLE_ERROR, handleBattleError(dispatch));

  fn(battleEngine);
}
