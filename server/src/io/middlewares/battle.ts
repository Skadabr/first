import { getErrorMessage } from "../../utils";
import { BATTLE_REQUEST } from "../game";
import { UserStatusType } from "../../constants";

export default function battleIOMiddleware({ logger, models }) {
  const Battle = models.model("Battle");

  return async (ws, next) => {
    try {
      await getBattle();
      getBattleOpponent();
      await sendBattle();

      ws.use(async ([event_name], next) => {
        try {
          await getBattle();
          getBattleOpponent();
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

    function getBattleOpponent() {
      if (!ws.battle) return;
      ws.opponent = ws.battle.getOpponentByUserId(ws.user._id);
    }

    async function sendBattle() {
      if (!ws.battle) return;

      _send(BATTLE_REQUEST, ws.opponent.socket_id, {
        data: ws.battle.toJSON()
      });

      logger.debug(`get battle object for ${ws.user.name}`);
    }

    function _send(event, opponent_sid, ...args) {
      ws.emit(event, ...args);
      ws.to(opponent_sid).emit(event, ...args);
    }
  };
}
