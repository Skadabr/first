import { logger } from "../index";
import { getErrorMessage } from "../../utils/index";

export function sendMessageLog(err, opponent) {
  if (err) return logger.error(getErrorMessage(err));
  if (opponent)
    logger.debug(`io:game - send message to ${opponent.name}`);
}

