import * as redux from "redux";

import { state } from "core";
// import battleMiddleware from "./actions/middlewares/battle";

const { battleReducer, battleUpdate, userReducer, userAdd } = state;

const EMPTY = {};

//
// ============ reducer ============
//

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
