const OPPONENT_UPSERT = "OPPONENT_UPSERT";

export default function({ logger }) {
  return (ws, next) => {
    const { name, status } = ws.user;
    ws.broadcast.emit(OPPONENT_UPSERT, { name, status });
    logger.debug("notify opponents about yourself");
    next();
  };
}
