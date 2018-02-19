// import { CLEAN_STATE } from "../constants";
//
// const GAME_UPDATE = "GAME_UPDATE";
// const GAME_TOOGLE = "GAME_TOOGLE";
// const GAME_SET_WINNER = "GAME_SET_WINNER";
// const GAME_INACTIVE = "GAME_INACTIVE";
//
// const EMPTY = {
//   status: GameStatus.None,
//   show_chat: false
// };
//
// //
// // ============ Reducer ============
// //
//
// export interface GameState {
//   status: GameStatus;
//   show_chat: boolean;
//   turn?: boolean;
//   my_name?: string;
//   opponent_name?: string;
// }
//
// export default function gameReducer(
//   state: GameState = EMPTY,
//   { type, payload }
// ): GameState {
//   switch (type) {
//     case GAME_UPDATE:
//       return { ...state, ...payload };
//
//     case GAME_TOOGLE:
//       return { ...state, show_chat: !state.show_chat };
//
//     case GAME_SET_WINNER:
//       return payload === state.my_name
//         ? { ...state, status: GameStatus.Win }
//         : payload === state.opponent_name
//           ? { ...state, status: GameStatus.Lose }
//           : { ...state, status: GameStatus.Broken };
//
//     case GAME_INACTIVE:
//     case CLEAN_STATE:
//       return EMPTY;
//     default:
//       return state;
//   }
// }
//
// //
// // ============ Actions ============
// //
//
// export function gameInit(
//   my_name: string,
//   opponent_name: string,
//   turn: boolean
// ) {
//   return {
//     type: GAME_UPDATE,
//     payload: { my_name, opponent_name, turn, status: GameStatus.Active }
//   };
// }
//
// export function gameTurnOn() {
//   return {
//     type: GAME_UPDATE,
//     payload: { turn: true }
//   };
// }
//
// export function gameTurnOff() {
//   return {
//     type: GAME_UPDATE,
//     payload: { turn: false }
//   };
// }
//
// export function gameToggleChat() {
//   return {
//     type: GAME_TOOGLE
//   };
// }
//
// export function gameInActive() {
//   return {
//     type: GAME_INACTIVE,
//   };
// }
//
// export function gameSetWinner(name) {
//   return {
//     type: GAME_SET_WINNER,
//     payload: name
//   };
// }
