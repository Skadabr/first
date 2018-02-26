const { Strategy, ExtractJwt } = require("passport-jwt");
const { JWT_SECRET } = process.env;

export default function jwt(User, logger) {
  return new Strategy(
    {
      secretOrKey: JWT_SECRET,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
    },
    async ({email}, done) => {
      const user = await User.findOne({ email });

      if (!user) {
        done({status: 401, message: "User with such email is not found"});
      } else {
        logger.debug("user %s is found", user.email);
        done(null, user);
      }
    }
  );
};
