import React from "react";
import { connect } from "react-redux";
import { Route } from "react-router-dom";

import { getShowBattleChat, isDesktop } from "../../selectors/ui";
import { GameStatus } from "../../constants";

import BattleRoute from "../roles/BattleRoute";
import Dashboard from "../dashboard/Dashboard";
import Battle from "../battle/Battle";
//import Chat from "../chat/Chat";
//import DeckEditor from "../deckeditor/DeckEditor";

export class UserPage extends React.PureComponent<any> {
  render() {
    return (
      <div className="row">
        <div className="col col-sm-5 col-md-4 col-lg-3">
          <Dashboard />
        </div>
        <BattleRoute path="/user/battle" component={Battle} />
      </div>
    );
  }
}

function mapStateToProps(state: any) {
  return {
    showChat: getShowBattleChat(state),
    isDesktop: isDesktop(state)
  };
}

export default connect(mapStateToProps)(UserPage as any);
