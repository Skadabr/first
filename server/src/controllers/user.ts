import { UserJSON } from "../models/user";

export default function UserController({ logger, models }) {
  const User = models.model("User");

  return {
    async create(req, resp) {
      try {
        const { email, name, password } = req.body;
        const user = User.createUser({ email, name, password });
        resp.status(201).send("");
      } catch (err) {
        let message;
        if (err.errors) {
          const key = Object.keys(err.errors)[0];
          message = err.errors[key].message;
        } else {
          message = err.message;
        }
        logger.debug("controllers:user - create ", message);
        resp.status(400).json({ error: { message } });
      }
    },

    user(req, resp) {
      const data: UserJSON = req.user.toJSON();
      resp.status(200).json({ data });
    }
  };
}
