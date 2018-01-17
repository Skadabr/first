import React from "react";
import PropTypes from "prop-types";

import { EMPTY } from "../../../state/game.state";

import BattleField from "./BattleField";

export default class Turn extends React.Component {
  onClick = ev => {
    this.props.turn();
  };

  render() {
    return (
      <div className="card-block">
        <button className="btn btn-primary" onClick={this.props.turn}>
          Turn
        </button>
      </div>
    );
  }
}
