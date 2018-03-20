import { getErrorMessage } from "../../utils/index";
import { BATTLE_REQUEST } from "../game";
import { UserStatusType } from "core"
import * as reducer from "../../reducer";

export default function battleIOMiddleware({ logger, models }) {
  const Battle = models.model("Battle");

  return async (ws, next) => {
    try {
      await getBattle();
      await getBattleEnemy();
      createStore();
      await sendBattle();

      ws.use(async ([eventName], next) => {
        try {
          await getBattle();
          await getBattleEnemy();
          createStore();
          next();
        } catch (err) {
          logger.error(getErrorMessage(err));
          next(err);
        }
      });

      next();
    } catch (err) {
      logger.error(getErrorMessage(err));
    }

    async function getBattle() {
      if (!ws.user || ws.user.status !== UserStatusType.Fight) return;

      ws.battle = await Battle.findBattleByUserId(ws.user._id);
    }

    async function getBattleEnemy() {
      if (!ws.battle) return;
      ws.opponent = await ws.battle.findEnemyByUserId(ws.user._id);
    }

    function createStore() {
      if (!ws.battle) return;
      const battleJSON = ws.battle.toJSON();
      const userJSON = ws.user.toJSON();
      ws.store = reducer.createStore(battleJSON, userJSON);
    }

    async function sendBattle() {
      if (!ws.battle) return;

      _send(BATTLE_REQUEST, ws.opponent.socketId, {
        data: ws.battle.toJSON()
      });
      logger.debug(`get battle object for ${ws.user.name}`);
    }

    function _send(event, opponentSid, ...args) {
      ws.emit(event, ...args);
      ws.to(opponentSid).emit(event, ...args);
    }
  };
}
