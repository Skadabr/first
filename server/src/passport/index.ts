const passport = require("passport");

import local from "./local";
import jwt from "./jwt";

export default function Passport({ models, logger }) {
  const User = models.model("User");

  passport.serializeUser((user, cb) => cb(null, user.name));
  passport.deserializeUser((name, cb) =>
    User.findOne({ name })
      .then(u => cb(null, u))
      .catch(cb)
  );

  passport.unuse("session");
  passport.use(local(User, logger));
  passport.use(jwt(User, logger));

  return passport;
}
