import { Router } from "express";

import UserController from "./controllers/user";
import AuthController from "./controllers/auth";

export default function setRoutes(opts) {
  const router = new Router();
  const { passport } = opts;

  const user = UserController(opts);
  const auth = AuthController(opts);

  router.post("/api/users/", user.create);
  router.post(
    "/api/auth/local",
    passport.authenticate("local"),
    auth.authSuccess,
    auth.authFailure
  );

  router.use("/api/user", passport.authenticate("jwt"));

  return router;
}
