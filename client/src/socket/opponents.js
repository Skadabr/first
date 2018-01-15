import {
  createOpponentCome,
  createOpponentGoes,
  createLoadOpponents
} from "../state/opponents.state";

const OPPONENT_ADD = "OPPONENT_ADD";
const OPPONENT_REMOVE = "OPPONENT_REMOVE";
const OPPONENT_COME = "OPPONENT_ONLINE";
const OPPONENT_GOES = "OPPONENT_OFFLINE";
const OPPONENTS_LIST_REQ = "OPPONENTS_LIST_REQ";
const OPPONENTS_LIST_RESP = "OPPONENTS_LIST_RESP";

export default function Game(ws, store) {
  ws.on("connect", () => {
    ws.emit(OPPONENTS_LIST_REQ);
  });

  ws.on(OPPONENT_COME, val => {
    store.dispatch(createOpponentCome(val));
  });

  ws.on(OPPONENT_GOES, val => {
    store.dispatch(createOpponentGoes(val));
  });

  ws.on(OPPONENTS_LIST_RESP, val => {
    console.log(val);
    if (val.error) {
      console.error(val.error.message);
    } else {
      store.dispatch(createLoadOpponents(val.data));
    }
  });

  return {
    ws,

    add() {
      ws.emit(OPPONENT_ADD);
    },

    remove() {
      ws.emit(OPPONENT_REMOVE);
    }
  };
}
