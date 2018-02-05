import React from "react";
import { connect } from "react-redux";
import { Route } from "react-router-dom";

import {fightIsStartedSelector} from "../../selectors/game";

import Dashboard from "../dashboard/Dashboard";
import Game from "../game/Game";

class UserPage extends React.Component {
  render() {
    return (
      this.props.fight ? <Game /> : <Dashboard />
    );
  }
}

function mapStateToProps(state) {
  return {
    fight: fightIsStartedSelector(state)
  };
}

export default connect(mapStateToProps)(UserPage);
