const OPPONENT_ADD = "OPPONENT_ADD";
const OPPONENT_REMOVE = "OPPONENT_REMOVE";
const OPPONENT_COME = "OPPONENT_ONLINE";
const OPPONENT_GOES = "OPPONENT_OFFLINE";

export default function(ws, { models, logger }) {
  const User = models.model("User");

  ws.on(OPPONENT_ADD, async name => {
    await User.findOneAndUpdate(
      { name },
      {
        socket: {
          nsp: ws.name,
          id: ws.id
        }
      }
    );
    logger.debug(`${name} come`);
    ws.broadcast.emit(OPPONENT_COME, name);
  });

  ws.on(OPPONENT_REMOVE, async name => {
    await User.findOneAndUpdate({ name }, { socket: null });
    logger.debug(`${name} goes`);
    ws.broadcast.emit(OPPONENT_GOES, name);
  });

  //ws.on(OPPONENT_CHALLANGE, async name => {
  //  await User.findOneAndUpdate({ name }, { accessible: true });
  //  logger.debug(`${name} is ready to challenge`);
  //});
}
