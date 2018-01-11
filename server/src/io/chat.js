const MESSAGE = "MESSAGE";
const USER_ADD = "USER_ADD";
const USER_REMOVE = "USER_REMOVE";

export default function(ws, { models, logger }) {
  const Message = models.model("Message");
  const ChatUsers = models.model("ChatUsers");

  ws.on("chat message", async val => {
    const { msg, user_name } = val;
    const created = new Date();
    await Message.create({ msg, user_name, created });
    logger.debug(`message from ${user_name} created`);
    ws.broadcast.emit("chat response", { msg, user, created });
  });
}
