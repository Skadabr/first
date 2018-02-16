import only = require("only");

import BattleController from "./controllers/battle";

export const OPPONENT_GOES = "OPPONENT_GOES";
export const OPPONENTS_LOAD = "OPPONENTS_LOAD";
export const OPPONENT_UPSERT = "OPPONENT_UPSERT";
export const USER_TRY_CREATE_BATTLE = "USER_TRY_CREATE_BATTLE";
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
  const { models, logger } = opts;
  const User = models.model("User");
  const Warrior = models.model("Warrior");

  const battleController = new BattleController(opts);

  //ws.on("disconnect", async () => {
  //  logger.debug("io:game - disconnect of ", ws.id);
  //  const user = ws.user;
  //  if (!user) return;

  //  const opponent = await User.opponent(ws.user);
  //  if (opponent) await opponent.resetGameData();
  //  await user.onDisconnect();

  //  logger.debug(`io:game - ${user.name}(id: ${ws.id}) goes`);
  //  ws.broadcast.emit(OPPONENT_GOES, user.name);
  //});

  ws.on(OPPONENTS_LOAD, battleController.loadOpponents);
  ws.on(USER_TRY_CREATE_BATTLE, battleController.tryCreateBattle);
  ws.on(SEND_MESSAGE, battleController.sendMessage);
  //ws.on(ADD_UNIT, battleController.addWarrior);

  //ws.on(TURN, async cb => { });
}
