import React from "react";
import PropTypes from "prop-types";

import { EMPTY } from "../../../state/game.state";

import BattleField from "./BattleField";

export default class Turn extends React.Component {
  render() {
    return (
      <div className="card-block">
        <button className="btn btn-primary" disabled={!this.props.turn} onClick={this.props.onTurn}>
          Turn
        </button>
      </div>
    );
  }
}
