import bind from "bind-decorator";

import {UserStatusType} from "core";
import { log } from "../../logger";
import {
  sendMessageLog
} from "../../logger/controllers/chat";
import {
  SEND_MESSAGE,
} from "../game";

export default class ChatController {
  private ws: any;

  constructor(ws, opts) {
    this.ws = ws;
  }

  @bind
  @log(sendMessageLog)
  public async sendMessage(data) {
    const {battle, user} = this.ws;
    if (!battle) return;

    const opponent = await battle.getEnemyOf(user._id);
    this.ws.to(opponent.socketId).emit(SEND_MESSAGE, data);
    return opponent;
  }

  //
  // ============ private ============
  //
}
