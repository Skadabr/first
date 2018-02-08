import { userUpdateStatus } from "../actions/user";
import { gameChatAddMessage } from "../actions/game_chat";
import {
  opponentsLoad,
  opponentsUpsert,
  opponentGoes
} from "../actions/opponents";
import { startFight, acquireTurn } from "../actions/battle";

const OPPONENT_UPSERT = "OPPONENT_UPSERT";
const OPPONENT_GOES = "OPPONENT_GOES";
const OPPONENTS_LOAD = "OPPONENTS_LOAD";
const SEND_MESSAGE = "SEND_MESSAGE";
const USER_READY = "USER_READY";
const USER_UPDATE_STATUS = "USER_UPDATE_STATUS";
const START_FIGHT = "START_FIGHT";
const ADD_MESSAGE = "ADD_MESSAGE";
const END_OF_FIGHT = "END_OF_FIGHT";
const TURN = "TURN";
const ACQUIRE_TURN = "ACQUIRE_TURN";
const FINISH_FIGHT = "FINISH_FIGHT";
const ADD_WARRIOR = "ADD_WARRIOR";

const ME = "ME";
const OPPONENT = "OPPONENT";

export default function Game(ws, store) {
  ws.on("error", console.error);

  ws.on("connect", () => {
    ws.emit(OPPONENTS_LOAD, val => {
      store.dispatch(opponentsLoad(val.data));
    });
  });

  ws.on(OPPONENT_UPSERT, val => store.dispatch(opponentsUpsert(val)));
  ws.on(OPPONENT_GOES, val => store.dispatch(opponentGoes(val)));

  ws.on(USER_UPDATE_STATUS, val => store.dispatch(userUpdateStatus(val)));

  ws.on(START_FIGHT, val => {
    startFight(val)(store.dispatch);
  });
  //ws.on(END_OF_FIGHT, val => endOfFight(val)(store.dispatch));
  ws.on(ACQUIRE_TURN, val => {
    acquireTurn(val)(store.dispatch);
  });
  ws.on(ADD_MESSAGE, ({ msg, name, date }) => {
    date = new Date(parseInt(date));
    store.dispatch(gameChatAddMessage(msg, name, date));
  });

  return {
    ws,

    readyToFight() {
      ws.emit(USER_READY);
    },

    sendMessage(msg, name, date) {
      date = date.getTime();
      ws.emit(SEND_MESSAGE, { msg, name, date });
    },

    addWarrior(kind, position) {
      ws.emit(ADD_WARRIOR, {kind, position});
    },

    passTheTurn(data) {
      ws.emit(TURN, data);
    },

    finishFight(cb) {
      ws.emit(FINISH_FIGHT);
    }
  };
}
