import {
  gamerKicked,
  gamerRelease,
  warriorKicked,
  warriorsRelease,
  gameTurnOff,
  userIncreaseRate,
  userDecreaseRate
} from "../reducers";

export function kick(warrior, opponent) {
  return dispatch => {
    if (opponent.warriors.length === 0) {
      return dispatch(gamerKicked(opponent.name, warrior.damage));
    }

    const { position, damage } = warrior;
    const op = opponent.warriors.find(op => op.position === position);

    if (op) return dispatch(warriorKicked(opponent.name, op.id, damage));

    const ops = opponent.warriors.filter(
      op => op.position === position - 1 || op.position === position + 1
    );

    if (ops.length === 0) dispatch(gamerKicked(opponent.name, warrior.damage));
    else for (const op of ops) dispatch(warriorKicked(opponent.name, op.id, damage));
  };
}

export function passTheTurn(myName, opponent) {
  return dispatch => {
    const io = IO().gameIO;

    if (opponent.health < 1) {
      io.winFight();
      dispatch(gamerRelease(myName));
      dispatch(gamerRelease(opponent.name));
      dispatch(warriorsRelease(myName));
      dispatch(warriorsRelease(opponent.name));
      dispatch(gameInActive());
      dispatch(userIncreaseRate());
      return;
    }

    io.passTheTurn({
      health: opponent.health,
      warriors: opponent.warriors,
      name: opponent.name
    });
    dispatch(gameTurnOff());
  };
}

export function looseTheGame() {
  return dispatch => {
    dispatch(gamerRelease(myName));
    dispatch(gamerRelease(opponent.name));
    dispatch(warriorsRelease(myName));
    dispatch(warriorsRelease(opponent.name));
    dispatch(gameInActive());
    dispatch(userDecreaseRate());
  };
}
