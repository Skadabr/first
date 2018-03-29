import { logger } from "../index";
import { getErrorMessage } from "../../utils/index";

export function sendMessageLog(err, enemy) {
  if (err) return logger.error(getErrorMessage(err));
  if (enemy)
    logger.debug(`io:game - send message to ${enemy.name}`);
}

