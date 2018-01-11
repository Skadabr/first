const OPPONENT_ADD = "OPPONENT_ADD";
const OPPONENT_REMOVE = "OPPONENT_REMOVE";
const OPPONENT_ONLINE = "OPPONENT_ONLINE";
const OPPONENT_OFFLINE = "OPPONENT_OFFLINE";

export default function(ws, { models, logger }) {
  const User = models.model("User");

  ws.on(OPPONENT_ADD, async name => {
    await User.findAndModify({ name }, undefined, {
      socket: {
        namespace: ws.name,
        id: ws.id
      }
    });
    logger.debug(`${name} online`);
    ws.broadcast.emit(OPPONENT_ONLINE, name);
  });

  ws.on(OPPONENT_REMOVE, async name => {
    await User.findAndModify({ name }, undefined, { socket: null });
    logger.debug(`${name} offline`);
    ws.broadcast.emit(OPPONENT_OFFLINE, name);
  });

  ws.on(OPPONENT_CHALLANGE, async name => {
    await User.findAndModify({ name }, undefined, { accessible: true });
    logger.debug(`${name} is ready to challenge`);
  });
}
