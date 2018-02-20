import bind from "bind-decorator";

import { log } from "../../logger";
import {
  getOnlineUsersLog,
} from "../../logger/controllers/user";

export default class UserController {
  private ws: any;
  private User: any;

  constructor(ws, {models}) {
    this.ws = ws;
    this.User = models.model("User");
  }

  @bind
  @log(getOnlineUsersLog)
  public async getOnlineUsers(cb) {
    const respData = await this.User.getOnlineUsers()
      .then(data => ({ data }))
      .catch(err => ({ error: { message: err.message } }));
    cb(respData);
  }

  //
  // ============ private ============
  //
}



//
// ============ helpers ============
//

