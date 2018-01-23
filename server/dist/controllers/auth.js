"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends =
  Object.assign ||
  function(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };

exports.default = AuthController;
function AuthController() {
  return {
    async authSuccess(req, resp) {
      const token = req.user.generateJWT();
      const user = req.user.toJSON();
      resp.status(200).json({ data: _extends({ token }, user) });
    },

    // eslint-disable-next-line
    async authFailure(err, req, resp, _) {
      resp.status(err.status).json({ error: { message: err.message } });
    }
  };
}
