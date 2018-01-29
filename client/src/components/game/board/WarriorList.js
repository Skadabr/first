import React from "react";
import PropTypes from "prop-types";

import { EMPTY } from "../../../state/game.state";

import BattleField from "./BattleField";


export default class WarriorList extends React.Component {
  onClick = ev => {
    this.props.submit(ev.currentTarget.dataset)
  };

  render() {
    return (
      <div id="warriors_list">
        <div
          data-type="pawn"
          data-health={6}
          data-damage={1}
          data-price={3}
          className="card-block"
          onClick={this.onClick}
        >
          <strong className="primary-font">Pawn</strong>
          <small className="float-right text-muted">6 / 1</small>
        </div>
        <div
          data-type="officer"
          data-health={4}
          data-damage={2}
          data-price={5}
          className="card-block"
          onClick={this.onClick}
        >
          <strong className="primary-font">Officer</strong>
          <small className="float-right text-muted">4 / 2</small>
        </div>
      </div>
    );
  }
}
