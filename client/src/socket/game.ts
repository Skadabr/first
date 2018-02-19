import { userUpdateStatus } from "../actions/user";
import { chatAddMessage } from "../actions/chat";
import {
  loadOpponents,
  opponentsUpsert,
  opponentGoes
} from "../actions/opponents";
import { createBattle } from "../actions/battle";
import { UnitTypes } from "../constants";

const OPPONENT_UPSERT = "OPPONENT_UPSERT";
const OPPONENT_GOES = "OPPONENT_GOES";
const OPPONENTS_LOAD = "OPPONENTS_LOAD";
const SEND_MESSAGE = "SEND_MESSAGE";
const BATTLE_REQUEST = "BATTLE_REQUEST";
const BATTLE_CREATE = "BATTLE_CREATE";
const USER_UPDATE_STATUS = "USER_UPDATE_STATUS";

// const TURN = "TURN";
// const ADD_UNIT = "ADD_WARRIOR";
// const UPDATE_WARRIOR = "UPDATE_WARRIOR";
// const KICK_OPPONENTS = "KICK_OPPONENTS";

export default function Game(ws, store) {
  ws.on("error", console.error);

  ws.on("connect", () => {
    ws.emit(OPPONENTS_LOAD, val => {
      store.dispatch(loadOpponents(val));
    });
  });

  ws.on(OPPONENT_UPSERT, val => store.dispatch(opponentsUpsert(val)));
  ws.on(OPPONENT_GOES, val => store.dispatch(opponentGoes(val)));

  ws.on(USER_UPDATE_STATUS, val => store.dispatch(userUpdateStatus(val)));

  ws.on(SEND_MESSAGE, ({ msg, name, date }) => {
    store.dispatch(chatAddMessage(msg, name, new Date(parseInt(date))));
  });
  ws.on(BATTLE_CREATE, val => createBattle(val)(store.dispatch));
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
    }

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
