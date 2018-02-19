import { logger } from "../index";
import { getErrorMessage } from "../../utils";

export function loadOpponentsLog(res) {
  if (res instanceof Error) return logger.error(getErrorMessage(res));
  if (res.error) return logger.error(res.error);

  logger.debug(`io:game - load oppoonents for ${this.ws.user.name}`);
}

export function sendMessageLog(err, opponent) {
  if (err) return logger.error(getErrorMessage(err));

  logger.debug(`io:game - send message to ${opponent.name}`);
}

export function _createBattleLog(err, res, user, opponent) {
  if (err) return logger.error(getErrorMessage(err));
  logger.debug(
    `io:game - create battle between ${user.name}(${user.socket_id}) and ` +
      `${opponent.name}(${opponent.socket_id})`
  );
}

export function _setUserReadyLog(err, res, user) {
  if (err) return logger.error(getErrorMessage(err));
  logger.debug(`io:game - user "${user.name}" ready to fight`);
}
