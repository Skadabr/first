export default function(ws, { models, logger }) {
  const Message = models.model("Message");
  const ChatUsers = models.model("ChatUsers");

  ws.on("chat message", async newMsg => {
    const { msg, user } = newMsg;
    const created = new Date();
    await Message.create({ msg, user, created });
    logger.debug(`message from ${user} created`);
    ws.broadcast.emit("chat response", { msg, user, created });
  });

  ws.on("chat add user", async name => {
    await ChatUsers.create({ name });
    logger.debug(`${name} online`);
    ws.broadcast.emit("chat user online", name);
  });

  ws.on("chat remove user", async name => {
    await ChatUsers.remove({ name });
    logger.debug(`${name} offline`);
    ws.broadcast.emit("chat user offline", name);
  });
}
