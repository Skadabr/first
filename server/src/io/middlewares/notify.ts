import { getErrorMessage } from "../../utils";

import { USERS_UPSERT } from "../game";

export default function notifyIOMiddleware({ logger }) {
  return (ws, next) => {
    try {
      const { name, status } = ws.user;
      ws.broadcast.emit(USERS_UPSERT, { name, status });
      logger.debug(`io:notify - notify users about ${name}`);
      next();
    } catch (err) {
      logger.error(getErrorMessage(err));
      next(err);
    }
  };
}
