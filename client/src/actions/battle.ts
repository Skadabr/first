import IO from "../socket";
import {
  gamerRelease,
  gamerAdd,
  gamerSetHealth,
  gamerSetMoney,
  gamerIsDamaged
} from "./gamers";
import {
  warriorsInit,
  warriorsSet,
  warriorsRelease,
  warriorIsKicked,
  warriorIsAttacking,
  warriorIsDamaged,
  warriorRemove,
  Warrior
} from "./warriors";
import {
  gameTurnOn,
  gameTurnOff,
  gameInit,
  gameInActive,
  gameSetWinner
} from "./game";
import { gameChatAddMessage } from "./game_chat";
import { userIncreaseRate, userDecreaseRate, userUpdateStatus } from "./user";
import {
  StatusKinds,
  WarriorKinds,
  GAMER_KICKED,
  WARRIOR_KICKED,
  WARRIOR_REMOVE,
  FINISH_FIGHT
} from "../constants";

export function startFight({ turn, me, opponent }) {
  return dispatch => {
    dispatch(userUpdateStatus(StatusKinds.FIGHT));
    dispatch(gamerAdd(me));
    dispatch(gamerAdd(opponent));
    dispatch(warriorsInit([me.name, opponent.name]));
    dispatch(gameInit(me.name, opponent.name, turn));
  };
}

export function sendMessage(msg, name) {
  return dispatch => {
    const date = new Date();
    IO().gameIO.sendMessage(msg, name, date);
    dispatch(gameChatAddMessage(msg, name, date));
  };
}

export function addWarrior(kind: WarriorKinds, position: number) {
  return dispatch => {
    const io = IO().gameIO;
    io.addWarrior(kind, position, val => {
      updateWarriors(val)(dispatch);
    });
  };
}

export function updateWarriors(val) {
  return dispatch => {
    if (val.error) {
      if (
        val.error.reason === "lack of money" ||
        val.error.reason === "overflow"
      ) {
        alert(val.error.msg);
      }
      return;
    }
    const { warriors, money, owner_name } = val.data;
    dispatch(warriorsSet(owner_name, warriors));
    dispatch(gamerSetMoney(owner_name, money));
  };
}

export function onTurn(my_name: string, my_warriors: Warrior[]) {
  return async dispatch => {
    const io = IO().gameIO;

    for (const w of my_warriors) {
      dispatch(warriorIsAttacking(my_name, w._id, true));

      const val = (await new Promise(ok => io.kickOpponents(w._id, ok))) as any;

      if (val.error) return console.error(val.error);

      const finished = await updateOnKick(val, my_name)(dispatch);
      if (finished) return;

      dispatch(warriorIsAttacking(my_name, w._id, false));
    }

    dispatch(gameTurnOff());
    io.passTheTurn(val => resetMoney(val)(dispatch));
  };
}

export function updateOnKick(val, my_name) {
  return async dispatch => {
    const { data, error } = val;

    if (error) return console.error(error.message);

    for (const msg of data) {
      if (msg.type === GAMER_KICKED) {
        const { name, health } = msg.data;
        dispatch(gamerSetHealth(name, health));
        dispatch(gamerIsDamaged(name, true));
        await new Promise(ok => {
          setTimeout(() => {
            dispatch(gamerIsDamaged(name, false));
            ok();
          }, 1000);
        });
      } else if (msg.type === WARRIOR_REMOVE) {
        const { owner_name, _id } = msg.data;
        dispatch(warriorRemove(owner_name, _id));
      } else if (msg.type === WARRIOR_KICKED) {
        const { owner_name, _id, health } = msg.data;
        dispatch(warriorIsKicked(owner_name, _id, health));
        dispatch(warriorIsDamaged(owner_name, _id, true));
        await new Promise(ok => {
          setTimeout(() => {
            dispatch(warriorIsDamaged(owner_name, _id, false));
            ok();
          }, 1000);
        });
      } else if (msg.type === FINISH_FIGHT) {
        const { winner_name } = msg.data;
        dispatch(gameSetWinner(winner_name));
        if (winner_name === my_name) {
          dispatch(userIncreaseRate());
        } else if (winner_name !== my_name) {
          dispatch(userDecreaseRate());
        }
        setTimeout(() => {
          dispatch(gameInActive());
          dispatch(userUpdateStatus(StatusKinds.PEACE));
        }, 2000);

        return true;
      }
    }
  };
}

export function resetMoney(val) {
  return dispatch => {
    if (val.error) return console.error(val.error);

    const { name, money } = val.data;
    dispatch(gamerSetMoney(name, money));
  };
}

export function acquireTurn(val) {
  return dispatch => {
    dispatch(gameTurnOn());
    resetMoney(val)(dispatch);
  };
}

//
//function cleanGameState(myName, opponentName) {
//  return dispatch => {
//    dispatch(gamerRelease(myName));
//    dispatch(gamerRelease(opponentName));
//    dispatch(warriorsRelease(myName));
//    dispatch(warriorsRelease(opponentName));
//    dispatch(gameInActive());
//  };
//}
