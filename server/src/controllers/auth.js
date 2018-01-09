module.exports = function AuthController() {
  return {
    async authSuccess(req, resp) {
      const token = req.user.generateJWT();
      resp.status(200).json({ data: { token } });
    },

    // eslint-disable-next-line
    async authFailure(err, req, resp, _) {
      resp.status(err.status).json({ error: { message: err.message } });
    }
  };
};
