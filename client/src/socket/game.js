import {
  opponentUpsert,
  opponentGoes,
  loadOpponents
} from "../state/opponents.state";
import { update } from "../state/user.state";
import { startFight, endOfFight, acquireTurn } from "../state/game.state";
import { addMessage } from "../state/game_chat.state";

const OPPONENT_UPSERT = "OPPONENT_UPSERT";
const OPPONENT_GOES = "OPPONENT_GOES";
const OPPONENTS_LOAD = "OPPONENTS_LOAD";
const SEND_MESSAGE = "SEND_MESSAGE";
const USER_READY = "USER_READY";
const USER_UPDATE = "USER_UPDATE";
const START_FIGHT = "START_FIGHT";
const ADD_MESSAGE = "ADD_MESSAGE";
const END_OF_FIGHT = "END_OF_FIGHT";
const TURN = "TURN";
const ACQUIRE_TURN = "ACQUIRE_TURN";
const FINISH_FIGHT = "FINISH_FIGHT";

const ME = "ME";
const OPPONENT = "OPPONENT";

export default function Game(ws, store) {
  ws.on("connect", () => {
    ws.emit(OPPONENTS_LOAD, val => loadOpponents(val)(store.dispatch));
  });

  ws.on(OPPONENT_UPSERT, val => opponentUpsert(val)(store.dispatch));
  ws.on(OPPONENT_GOES, val => opponentGoes(val)(store.dispatch));

  ws.on(USER_UPDATE, val => update(val)(store.dispatch));

  ws.on(START_FIGHT, val => startFight(val)(store.dispatch));
  ws.on(END_OF_FIGHT, val => endOfFight(val)(store.dispatch));
  ws.on(ACQUIRE_TURN, val => {
    const me = val[ME];
    const opponent = val[OPPONENT];
    acquireTurn(me, opponent)(store.dispatch);
  });
  ws.on(ADD_MESSAGE, val => {
    val.date = new Date(parseInt(val.date));
    addMessage(val)(store.dispatch);
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

    toTurn(me, opponent) {
      ws.emit(TURN, {
        me: { health: me.health, warriors: me.warriors, money: me.money },
        opponent: { health: opponent.health, warriors: opponent.warriors }
      });
    },

    finishFight(cb) {
      ws.emit(FINISH_FIGHT);
    }
  };
}
