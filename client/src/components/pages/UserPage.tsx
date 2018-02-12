import React from "react";
import { connect } from "react-redux";
import { Route } from "react-router-dom";

import { fightIsStartedSelector, showChatSelector } from "../../selectors/game";
import { isDesktopSelector } from "../../selectors/stats";

import Dashboard from "../dashboard/Dashboard";
import Game from "../game/Game";

interface UserPagePropTypes {
  fight: boolean;
  isDesktop: boolean;
  showChat: boolean;
}

export class UserPage extends React.PureComponent<UserPagePropTypes> {
  render() {
    const { fight, isDesktop, showChat } = this.props;
    return fight ? <Game isDesktop={isDesktop} showChat={showChat} /> : <Dashboard />;
  }
}

function mapStateToProps(state: any) {
  return {
    fight: fightIsStartedSelector(state),
    showChat: showChatSelector(state),
    isDesktop: isDesktopSelector(state)
  };
}

export default connect(mapStateToProps)(UserPage);
