import { UnitTypes, state } from "core";
import { chatAddMessage } from "../actions/chat";
import { createBattle } from "../actions/battle_process";

const { loadUsers, usersUpsert, usersRemove, userUpdateStatus } = state;

const USER_GOES = "USER_GOES";
const GET_USERS = "GET_USERS";
const USERS_UPSERT = "USERS_UPSERT";
const BATTLE_REQUEST = "BATTLE_REQUEST";
const USER_UPDATE_STATUS = "USER_UPDATE_STATUS";
const SEND_MESSAGE = "SEND_MESSAGE";
const TURN = "TURN";
const ADD_UNIT = "ADD_UNIT";
const ATTACK = "ATTACK";

export default function Game(ws, store, router) {
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
  ws.on(BATTLE_REQUEST, val => createBattle(val, router)(store.dispatch));

  return {
    ws,

    readyToFight() {
      ws.emit(BATTLE_REQUEST);
    },

    sendMessage(msg, name, date) {
      date = date.getTime();
      ws.emit(SEND_MESSAGE, { msg, name, date });
    },

    addUnit(card_id: string, position, cb) {
      ws.emit(ADD_UNIT, { card_id, position }, cb);
    },

    passTheTurn(cb) {
      ws.emit(TURN);
    },

    attack(data) {
      ws.emit(ATTACK, data);
    }
  };
}
