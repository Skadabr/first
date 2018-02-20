import { logger } from "../index";
import { getErrorMessage } from "../../utils";

export function getOnlineUsersLog(res) {
  if (res instanceof Error) return logger.error(getErrorMessage(res));
  if (res.error) return logger.error(res.error);

  logger.debug(`io:game - load oppoonents for ${this.ws.user.name}`);
}
