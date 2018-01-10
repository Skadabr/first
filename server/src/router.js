import { Router } from "express";

import UserController from "./controllers/user";
import AuthController from "./controllers/auth";
import MessageController from "./controllers/message";

export default function setRoutes(opts) {
  const router = new Router();
  const { passport } = opts;

  const user = UserController(opts);
  const auth = AuthController(opts);
  const message = MessageController(opts);

  router.post("/api/users/", user.create);
  router.post(
    "/api/auth/local",
    passport.authenticate("local"),
    auth.authSuccess,
    auth.authFailure
  );
  router.get("/api/messages", message.index);

  router.use("/api/user", passport.authenticate("jwt"));

  return router;
}
