import passportLocal, { Strategy } from "passport-local";
import bcrypt from "bcryptjs";

export default function local(User, logger) {
  return new Strategy({ usernameField: "email" }, async (email, pass, done) => {
    logger.debug("email: %s, password: %s", email, pass);

    const user = await User.findOne({ email }).exec();

    if (!user) {
      return done({ status: 401, message: "Email/Password is wrong" });
    }

    logger.debug(`user ${user.email} is found`);

    let auth = await bcrypt.compare(pass, user.phash);

    if (!auth) {
      return done({ status: 401, message: "Email/Password is wrong" });
    }

    done(null, user);
  });
}
