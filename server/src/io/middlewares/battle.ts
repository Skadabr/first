import { getErrorMessage } from "../../utils";

export default function battleIOMiddleware({ logger, models }) {
  const Battle = models.model("Battle");

  return async (ws, next) => {
    ws.use(async ([event_name, data], next) => {
      try {
        if (data && data.battle) {
          ws.battle = await Battle.findOne({ _id: data.battle._id });
        }
        next();
      } catch (err) {
        logger.error(getErrorMessage(err));
        next(err);
      }
    });
    next();
  };
}
