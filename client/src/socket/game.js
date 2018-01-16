import {
  createOpponentCome,
  createOpponentGoes,
  createLoadOpponents
} from "../state/opponents.state";

const OPPONENT_COME = "OPPONENT_ONLINE";
const OPPONENT_GOES = "OPPONENT_OFFLINE";
const OPPONENTS_LIST = "OPPONENTS_LIST";

export default function Game(ws, store) {
  ws.on("connect", () => {
    ws.emit(OPPONENTS_LIST, val => {
      if (val.error) {
        console.error(val.error.message);
      } else {
        store.dispatch(createLoadOpponents(val.data));
      }
    });
  });

  ws.on(OPPONENT_COME, val => {
    store.dispatch(createOpponentCome(val));
  });

  ws.on(OPPONENT_GOES, val => {
    store.dispatch(createOpponentGoes(val));
  });

  return {
    ws,

    readyToFight() {}
  };
}
