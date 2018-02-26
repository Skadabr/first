import { logger } from "../index";
import { getErrorMessage } from "../../utils";

export function _newBattleLog(err, res, user, opponent) {
  if (err) return logger.error(getErrorMessage(err));
  logger.debug(
    `io:game - new battle between ${user.name}(${user.socket_id}) and ` +
      `${opponent.name}(${opponent.socket_id})`
  );
}

export function _setUserReadyLog(err, res, user) {
  if (err) return logger.error(getErrorMessage(err));
  logger.debug(`io:game - user "${user.name}" ready to fight`);
}
