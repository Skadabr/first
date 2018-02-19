import only = require("only");

import BattleController from "./controllers/battle";

export const OPPONENT_GOES = "OPPONENT_GOES";
export const OPPONENTS_LOAD = "OPPONENTS_LOAD";
export const OPPONENT_UPSERT = "OPPONENT_UPSERT";
export const BATTLE_REQUEST = "BATTLE_REQUEST";
export const USER_UPDATE_STATUS = "USER_UPDATE_STATUS";
export const BATTLE_CREATE = "BATTLE_CREATE";
export const SEND_MESSAGE = "SEND_MESSAGE";
export const TURN = "TURN";

export const ADD_UNIT = "ADD_UNIT";

export const GAMER_KICKED = "GAMER_KICKED";
export const WARRIOR_KICKED = "WARRIOR_KICKED";
export const WARRIOR_REMOVE = "WARRIOR_REMOVE";
export const FINISH_FIGHT = "FINISH_FIGHT";

export default function(ws, opts) {
  const { logger } = opts;
  const battleController = new BattleController(ws, opts);

  ws.on("disconnect", onDisconnect);

  ws.on(OPPONENTS_LOAD, battleController.loadOpponents);
  ws.on(BATTLE_REQUEST, battleController.tryCreateBattle);
  ws.on(SEND_MESSAGE, battleController.sendMessage);

  //ws.on(ADD_UNIT, battleController.addWarrior);
  //ws.on(TURN, async cb => { });

  async function onDisconnect() {
    const { user } = ws;
    if (!user) return;

//  const opponent = await user.getOpponent();
//  if (opponent) await opponent.resetGameData();
//  await user.onDisconnect();

    ws.broadcast.emit(OPPONENT_GOES, user.name);

    logger.debug(`io:game - disconnect - ${user.name}(id: ${ws.id}) goes`);
  }
}
