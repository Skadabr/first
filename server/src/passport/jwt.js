const { Strategy, ExtractJwt } = require("passport-jwt");
const { JWT_SECRET } = process.env;

module.exports = function jwt(User, logger) {
  return new Strategy(
    {
      secretOrKey: JWT_SECRET,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
    },
    async (payload, done) => {
      const { email } = payload;
      const user = await User.findOne({ email });

      if (!user) {
        done();
      } else {
        logger.debug("user %s is found", user.email);
        done(null, user);
      }
    }
  );
};
