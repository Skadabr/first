import IO from "../socket";
import { userIncreaseRate, userDecreaseRate, userUpdateStatus } from "./user";
import {
  playerAddCards,
  playerAddUnit,
  playerRemoveCard,
  playerDecreseMoney,
} from "./battle/player";
import { battleUpdate } from "./battle";

import { UserStatusType, UnitTypes } from "../constants";

//
// ============ Actions ============
//
export function createBattle(val, router) {
  return dispatch => {
    const { data, error } = val;
    // if (error) ????;

    dispatch(userUpdateStatus(UserStatusType.Fight));
    dispatch(battleUpdate(data));
    router.history.push("/user/battle");
  };
}

export function addUnit(card: any, position: number, player: any) {
  return dispatch => {
    const io = IO().gameIO;

    dispatch(playerRemoveCard(card));
    dispatch(playerDecreseMoney(player, card.unit.cost));
    dispatch(playerAddUnit(card.unit, position, card.effects));

    io.addUnit(card._id, position, val => dispatch(battleUpdate(val)));
  };
}

export function onTurn() {}
// export function onTurn(my_name: string, my_warriors: Warrior[]) {
//   return async dispatch => {
//     const io = IO().gameIO;
//
//     for (const w of my_warriors) {
//       dispatch(warriorIsAttacking(my_name, w._id, true));
//
//       const val = (await new Promise(ok => io.kickOpponents(w._id, ok))) as any;
//
//       if (val.error) return console.error(val.error);
//
//       const finished = await updateOnKick(val, my_name)(dispatch);
//       if (finished) return;
//
//       dispatch(warriorIsAttacking(my_name, w._id, false));
//     }
//
//     dispatch(gameTurnOff());
//     io.passTheTurn(val => resetMoney(val)(dispatch));
//   };
// }
//
// export function updateOnKick(val, my_name) {
//   return async dispatch => {
//     const { data, error } = val;
//
//     if (error) return console.error(error.message);
//
//     for (const msg of data) {
//       if (msg.type === GAMER_KICKED) {
//         const { name, health } = msg.data;
//         dispatch(gamerSetHealth(name, health));
//         dispatch(gamerIsDamaged(name, true));
//         await new Promise(ok => {
//           setTimeout(() => {
//             dispatch(gamerIsDamaged(name, false));
//             ok();
//           }, 1000);
//         });
//       } else if (msg.type === WARRIOR_REMOVE) {
//         const { owner_name, _id } = msg.data;
//         dispatch(warriorRemove(owner_name, _id));
//       } else if (msg.type === WARRIOR_KICKED) {
//         const { owner_name, _id, health } = msg.data;
//         dispatch(warriorIsKicked(owner_name, _id, health));
//         dispatch(warriorIsDamaged(owner_name, _id, true));
//         await new Promise(ok => {
//           setTimeout(() => {
//             dispatch(warriorIsDamaged(owner_name, _id, false));
//             ok();
//           }, 1000);
//         });
//       } else if (msg.type === FINISH_FIGHT) {
//         const { winner_name } = msg.data;
//         dispatch(gameSetWinner(winner_name));
//         if (winner_name === my_name) {
//           dispatch(userIncreaseRate());
//         } else if (winner_name !== my_name) {
//           dispatch(userDecreaseRate());
//         }
//         setTimeout(() => {
//           dispatch(gameInActive());
//           dispatch(userUpdateStatus(StatusKinds.PEACE));
//         }, 2000);
//
//         return true;
//       }
//     }
//   };
// }
//
// export function resetMoney(val) {
//   return dispatch => {
//     if (val.error) return console.error(val.error);
//
//     const { name, money } = val.data;
//     dispatch(gamerSetMoney(name, money));
//   };
// }
//
// export function acquireTurn(val) {
//   return dispatch => {
//     dispatch(gameTurnOn());
//     resetMoney(val)(dispatch);
//   };
// }

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
