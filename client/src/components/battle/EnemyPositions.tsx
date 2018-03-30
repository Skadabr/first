import React from "react";
import { POSITIONS, UnitTypes } from "core";
import { createNumberSequence } from "../../utils/common";

import Position from "./Position";
import UnitTarget from "./UnitTarget";
import UnitCardView from "./UnitCardView";

const positions = createNumberSequence(POSITIONS);

export default class EnemyPositions extends React.PureComponent<any> {
  render() {
    const { owner_name, units, availableTargets, onAttack } = this.props;

    const width = (100 / POSITIONS) | 0;

    return (
      <div
        className="card-block"
        style={{ display: "flex", flexDirection: "row", maxHeight: "auto" }}
      >
        {positions.map(position => {
          const unit = units.find(u => u.position === position);
          let child;
          if (!unit) {
            child = null;
          } else if (availableTargets.includes(unit._id)) {
            child = <UnitTarget unit={unit} onDrop={onAttack} />;
          } else {
            child = <UnitCardView {...unit} />;
          }

          return (
            <div key={position}>
              <Position width={width}>
                {child}
              </Position>
            </div>
          );
        })}
      </div>
    );
  }
}
