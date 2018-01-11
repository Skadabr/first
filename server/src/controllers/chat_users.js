export default function UserController({ logger, models }) {
  const ChatUsers = models.model("ChatUsers");

  return {
    async index(req, resp) {
      try {
        const users = await ChatUsers.find().exec();
        const data = users.map(u => u.name);
        resp.status(200).json({ data });
      } catch (err) {
        logger.debug("can't load messages: " + err.message);
        resp.status(400).json({ error: { message: err.message } });
      }
    }
  };
}
