import {
  opponentUpsert,
  opponentGoes,
  loadOpponents,
  OPPONENT_UPSERT,
  OPPONENT_GOES,
  OPPONENTS_LOAD
} from "../state/opponents.state";
import { USER_READY, USER_UPDATE, update } from "../state/user.state";
import { START_FIGHT, startFight } from "../state/game.state";
import { ADD_MESSAGE, addMessage } from "../state/game_chat.state";

export default function Game(ws, store) {
  ws.on("connect", () => {
    ws.emit(OPPONENTS_LOAD, val => loadOpponents(val)(store.dispatch));
  });

  ws.on(OPPONENT_UPSERT, val => opponentUpsert(val)(store.dispatch));
  ws.on(OPPONENT_GOES, val => opponentGoes(val)(store.dispatch));

  ws.on(USER_UPDATE, val => update(val)(store.dispatch));

  ws.on(START_FIGHT, val => startFight(val)(store.dispatch));

  ws.on(ADD_MESSAGE, val => addMessage(val)(store.dispatch));

  return {
    ws,

    readyToFight() {
      ws.emit(USER_READY);
    }
  };
}
