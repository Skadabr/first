import _, {
  createOpponentCome,
  createOpponentGoes
} from "../state/opponents.state";

const OPPONENT_ADD = "OPPONENT_ADD";
const OPPONENT_REMOVE = "OPPONENT_REMOVE";
const OPPONENT_COME = "OPPONENT_ONLINE";
const OPPONENT_GOES = "OPPONENT_OFFLINE";

export default function Opponents(ws, store) {
  ws.on(OPPONENT_COME, val => {
    store.dispatch(createOpponentCome(val));
  });

  ws.on(OPPONENT_GOES, val => {
    store.dispatch(createOpponentGoes(val));
  });

  return {
    add(user) {
      ws.emit(OPPONENT_ADD, user);
    },

    remove(user) {
      ws.emit(OPPONENT_REMOVE, user);
    }
  };
}
