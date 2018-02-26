import React from "react";
import { connect } from "react-redux";
import { Route } from "react-router-dom";

import { showBattleChatSelector, isDesktopSelector } from "../../selectors/ui";
import { GameStatus } from "../../constants";

import BattleRoute from "../roles/BattleRoute";
import Dashboard from "../dashboard/Dashboard";
import Chat from "../chat/Chat";
import Battle from "../battle/Battle";
//import DeckEditor from "../deckeditor/DeckEditor";

interface UserPagePropTypes {
  battleIsStarted: boolean;
  isDesktop: boolean;
  showChat: boolean;
}

export class UserPage extends React.PureComponent<UserPagePropTypes> {
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

  //render() {
  //  const { battleIsStarted, isDesktop, showChat } = this.props;
  //  return battleIsStarted ? (
  //    isDesktop ? (
  //      <div className="row">
  //        <div className="col-lg-9">
  //          <Battle />
  //        </div>
  //        <div className="col-lg-3">
  //          <Chat />
  //        </div>
  //      </div>
  //    ) : (
  //      <div className="row">
  //        {showChat ? (
  //          <div className="col-12">
  //            <Chat />
  //          </div>
  //        ) : (
  //          <div className="col-12">
  //            <Battle />
  //          </div>
  //        )}
  //      </div>
  //    )
  //  ) : (
  //    <Dashboard />
  //  );
  //}
}

function mapStateToProps(state: any) {
  return {
    showChat: showBattleChatSelector(state),
    isDesktop: isDesktopSelector(state)
  };
}

export default connect(mapStateToProps)(UserPage as any);
