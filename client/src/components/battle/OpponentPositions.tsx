import React from "react";
import { POSITIONS, UnitTypes } from "../../constants";
import { createNumberSequence } from "../../utils/common";

import Position from "./Position";
import UnitTarget from "./UnitTarget";
import UnitCardView from "./UnitCardView";

const positions = createNumberSequence(POSITIONS);

export default class OpponentPositions extends React.PureComponent<any> {
  render() {
    const { owner_name, units, onAttack } = this.props;

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
          } else if (unit.available > 0) {
            child = <UnitTarget unit={unit} onDrop={onAttack} />;
          } else {
            child = <UnitCardView {...unit} />;
          }

          return (
            <Position key={position} width={width}>
              {child}
            </Position>
          );
        })}
      </div>
    );
  }
}
