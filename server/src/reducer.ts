import * as redux from "redux";

import battleMiddleware from "./actions/middlewares/battle";
import battleReducer, { battleUpdate } from "./actions/battle";
import userReducer, { userAdd } from "./actions/user";

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
