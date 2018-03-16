import * as redux from "redux";

import { state } from "core";
// import battleMiddleware from "./actions/middlewares/battle";

const { battleReducer, battleUpdate, userReducer, userAdd } = state;

const EMPTY = {};

//
// ============ reducer ============
//

export default function reducer(state = EMPTY as any, action) {
  return {
    battle: battleReducer(state.battle, action),
    user: userReducer(state.user, action)
  };
}

export function createStore(battle, user) {
  const store = redux.createStore(
    reducer,
    //redux.applyMiddleware(battleMiddleware())
    { battle, user }
  );
  //store.dispatch(battleUpdate(battle));
  //store.dispatch(userAdd(user));
  return store;
}
