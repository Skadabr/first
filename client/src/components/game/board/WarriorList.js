import React from "react";
import PropTypes from "prop-types";

//import BattleField from "./BattleField";
import WarriorSample from "./WarriorSample";
import warriors_list from "../../../utils/warriors_list";

export default class WarriorList extends React.Component {
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
            <WarriorSample {...w} />
          </div>
        ))}
      </div>
    );
  }
}
