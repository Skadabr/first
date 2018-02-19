import { logger } from "../index";
import { getErrorMessage } from "../../utils";

export function loadOpponentsLog(target, err, res) {
  if (err) return logger.error(getErrorMessage(err));

  logger.debug(`io:game - load oppoonents for ${target.ws.user.name}`);
}

export function sendMessageLog(target, err, res) {
  if (err) return logger.error(getErrorMessage(err));

  logger.debug(`io:game - send message to ${opponent.name}`);
}

export function _createBattleLog(target, err, res, [user, opponent]) {
  if (err) return logger.error(getErrorMessage(err));
  logger.debug(
    `io:game - create battle between ${user.name}(${user.socket_id}) and ` +
      `${opponent.name}(${opponent.socket_id})`
  );
}

export function _setUserReadyLog(target, err, res, [user]) {
  if (err) return logger.error(getErrorMessage(err));
  logger.debug(`io:game - user "${user.name}" ready to fight`);
}
