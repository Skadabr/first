const OPPONENT_UPSERT = "OPPONENT_UPSERT";

export default function({ logger }) {
  return (ws, next) => {
    ws.broadcast.emit(OPPONENT_UPSERT, {
      name: user.name,
      status: user.status
    });
  };
}
