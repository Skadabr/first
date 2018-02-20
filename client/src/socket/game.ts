import { userUpdateStatus } from "../actions/user";
import { chatAddMessage } from "../actions/chat";
import {
  loadUsers,
  usersUpsert,
  usersRemove
} from "../actions/users";
import { createBattle } from "../actions/battle";
import { UnitTypes } from "../constants";

const USER_GOES = "USER_GOES";
const GET_USERS = "GET_USERS";
const USERS_UPSERT = "USERS_UPSERT";
const BATTLE_REQUEST = "BATTLE_REQUEST";
const USER_UPDATE_STATUS = "USER_UPDATE_STATUS";
const SEND_MESSAGE = "SEND_MESSAGE";
const TURN = "TURN";
const ADD_UNIT = "ADD_UNIT";

export default function Game(ws, store) {
  ws.on("error", console.error);

  ws.on("connect", () => {
    ws.emit(GET_USERS, val => store.dispatch(loadUsers(val)));
  });

  ws.on(USERS_UPSERT, val => store.dispatch(usersUpsert(val)));
  ws.on(USER_GOES, val => store.dispatch(usersRemove(val)));

  ws.on(USER_UPDATE_STATUS, val => store.dispatch(userUpdateStatus(val)));

  ws.on(SEND_MESSAGE, ({ msg, name, date }) => {
    store.dispatch(chatAddMessage(msg, name, new Date(parseInt(date))));
  });
  ws.on(BATTLE_REQUEST, val => createBattle(val)(store.dispatch));
  //ws.on(UPDATE_WARRIOR, val => updateWarriors(val)(store.dispatch));
  //ws.on(KICK_OPPONENTS, val =>
  //  updateOnKick(val, store.getState().game.my_name)(store.dispatch)
  //);
  //ws.on(TURN, val => acquireTurn(val)(store.dispatch));

  return {
    ws,

    readyToFight() {
      ws.emit(BATTLE_REQUEST);
    },

    sendMessage(msg, name, date) {
      date = date.getTime();
      ws.emit(SEND_MESSAGE, { msg, name, date });
    },

    //  addUnit(type: UnitTypes, position, cb) {
    //    ws.emit(ADD_UNIT, { kind, position }, cb);
    //  },

    //  act(_id: string, cb) {
    //    ws.emit(KICK_OPPONENTS, { _id }, cb);
    //  },

    //  passTheTurn(cb) {
    //    ws.emit(TURN, cb);
    //  }
  };
}
