import React from "react";
import { connect } from "react-redux";
import { Route } from "react-router-dom";

import { fightIsStartedSelector, showChatSelector, gameStatusSelector } from "../../selectors/game";
import { isDesktopSelector } from "../../selectors/stats";
import { GameStatus } from "../../actions/game";

import Dashboard from "../dashboard/Dashboard";
import Game from "../game/Game";

interface UserPagePropTypes {
  fight: boolean;
  game_status: GameStatus;
  isDesktop: boolean;
  showChat: boolean;
}

export class UserPage extends React.PureComponent<UserPagePropTypes> {
  render() {
    const { fight, game_status, isDesktop, showChat } = this.props;
    return fight ? <Game isDesktop={isDesktop} showChat={showChat} status={game_status} /> : <Dashboard />;
  }
}

function mapStateToProps(state: any) {
  return {
    fight: fightIsStartedSelector(state),
    game_status: gameStatusSelector(state),
    showChat: showChatSelector(state),
    isDesktop: isDesktopSelector(state)
  };
}

export default connect(mapStateToProps)(UserPage);
