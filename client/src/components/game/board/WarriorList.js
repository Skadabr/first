import React from "react";
import PropTypes from "prop-types";

import { EMPTY } from "../../../state/game.state";

import BattleField from "./BattleField";
import warriors_list from "../../../utils/warriors_list";

export default class WarriorList extends React.Component {
  onClick = ev => {
    this.props.submit(ev.currentTarget.dataset);
  };

  render() {
    return (
      <div id="warriors_list">
        {warriors_list.map((w, i) => (
          <div
            key={i}
            data-type={w.type}
            data-health={w.health}
            data-damage={w.damage}
            data-price={w.price}
            className="card-block"
            onClick={this.onClick}
          >
            <strong className="primary-font">
              {w.type[0].toUpperCase() + w.type.slice(1)}
            </strong>
            <small className="float-right text-muted">
              {w.health} / {w.damage} - price({w.price})
            </small>
          </div>
        ))}
      </div>
    );
  }
}
