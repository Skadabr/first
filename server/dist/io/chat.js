"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (ws, { models, logger }) {
  const Message = models.model("Message");

  ws.on("chat message", async newMsg => {
    console.log("NEW   >> ", newMsg);
    const { msg, user } = newMsg;
    const created = new Date();
    await Message.create({ msg, user, created });
    logger.debug(`message from ${user} created`);
    ws.broadcast.emit("chat response", { msg, user, created });
  });
};