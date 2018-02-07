import React from "react";
import { connect } from "react-redux";
import { Route } from "react-router-dom";

import { fightIsStartedSelector } from "../../selectors/game";

import Dashboard from "../dashboard/Dashboard";
import Game from "../game/Game";

interface PropTypes {
  fight: boolean;
}

export function UserPage({ fight }: PropTypes) {
  return fight ? <Game /> : <Dashboard />;
}

function mapStateToProps(state: any) {
  return {
    fight: fightIsStartedSelector(state)
  };
}

export default connect(mapStateToProps)(UserPage);
