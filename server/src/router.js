import { Router } from "express";

import UserController from "./controllers/user";
import AuthController from "./controllers/auth";
import MessageController from "./controllers/message";
import ChatUsersController from "./controllers/chat_users";

export default function setRoutes(opts) {
  const router = new Router();
  const { passport } = opts;

  const user = UserController(opts);
  const auth = AuthController(opts);
  const message = MessageController(opts);
  const chat_users = ChatUsersController(opts);

  router.post("/api/users/", user.create);
  router.post(
    "/api/auth/local",
    passport.authenticate("local"),
    auth.authSuccess,
    auth.authFailure
  );

  router.use("/api", passport.authenticate("jwt"));
  router.get("/api/messages", message.index);
  router.get("/api/chat_users", chat_users.index);

  return router;
}
