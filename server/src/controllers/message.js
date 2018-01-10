export default function UserController({ logger, models }) {
  const Message = models.model("Message");

  return {
    async index(req, resp) {
      try {
        const amount = req.query.amount | 0;
        const messages = await Message.find().limit(amount || 10);
        const data = messages.map(m => m.toJSON());
        resp.status(200).json({ data });
      } catch (err) {
        logger.debug("can't load messages: " + err.message);
        resp.status(400).json({ error: { message: err.message } });
      }
    }
  };
}
