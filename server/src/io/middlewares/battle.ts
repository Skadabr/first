import { getErrorMessage } from "../../utils/index";
import { BATTLE_REQUEST } from "../game";
import { UserStatusType } from "core";

export default function battleIOMiddleware({ logger, models }) {
  const Battle = models.model("Battle");

  return async (ws, next) => {
    try {
      await getBattle();
      await getBattleEnemy();
      await sendBattle();

      ws.use(async ([eventName], next) => {
        try {
          await getBattle();
          await getBattleEnemy();
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

    // === where ===

    async function getBattle() {
      if (!ws.user || ws.user.status !== UserStatusType.Fight) return;
      ws.battle = await Battle.findBattleByUserId(ws.user._id);
    }

    async function getBattleEnemy() {
      if (!ws.battle) return;
      ws.enemy = await ws.battle.findEnemyByUserId(ws.user._id);
    }

    async function sendBattle() {
      if (!ws.battle) return;
      const data = ws.battle.toJSON();
      _send(BATTLE_REQUEST, ws.enemy.socketId, { data });
      logger.debug(`get battle object for ${ws.user.name}`);
    }

    function _send(event, enemySid, ...args) {
      ws.emit(event, ...args);
      ws.to(enemySid).emit(event, ...args);
    }
  };
}
