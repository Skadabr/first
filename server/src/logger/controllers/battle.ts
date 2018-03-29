import { logger } from "../index";
import { getErrorMessage } from "../../utils/index";

export function _newBattleLog(err, res, user, enemy) {
  if (err) return logger.error(getErrorMessage(err));
  logger.debug(
    `io:game - new battle between ${user.name}(${user.socketId}) and ` +
      `${enemy.name}(${enemy.socketId})`
  );
}

export function _setUserReadyLog(err, res, user) {
  if (err) return logger.error(getErrorMessage(err));
  logger.debug(`io:game - user "${user.name}" ready to fight`);
}
