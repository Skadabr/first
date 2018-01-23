export default function AuthController() {
  return {
    async authSuccess(req, resp) {
      const token = req.user.generateJWT();
      const user = req.user.toJSON();
      resp.status(200).json({ data: { token, ...user } });
    },

    // eslint-disable-next-line
    async authFailure(err, req, resp, _) {
      resp.status(err.status).json({ error: { message: err.message } });
    }
  };
}
