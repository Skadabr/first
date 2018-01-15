export default function UserController({ logger, models }) {
  const User = models.model("User");

  return {
    async create(req, resp) {
      try {
        const { email, name, password } = req.body;
        const user = new User({ email, name });
        await user.setPassword(password);
        await user.save().then();
        logger.debug(`user ${email} created`, email);
        resp.status(201).send("");
      } catch (err) {
        let message;
        if (err.errors) {
          const key = Object.keys(err.errors)[0];
          message = err.errors[key].message;
        } else {
          message = err.message;
        }
        logger.debug("create user error: ", message);
        resp.status(400).json({ error: { message } });
      }
    },

    async index(req, resp) {}
  };
}
