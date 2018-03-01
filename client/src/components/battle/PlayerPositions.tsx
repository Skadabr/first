import React from "react";
import { POSITIONS, UnitTypes } from "../../constants";
import { createNumberSequence } from "../../utils/common";

import DropPosition from "./DropPosition";
import Unit from "./Unit";
import UnitCardView from "./UnitCardView";

const positions = createNumberSequence(POSITIONS);

export default class PlayerPositions extends React.PureComponent<any> {
  render() {
    const { owner_name, units, onAddUnit } = this.props;

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
          } else if (unit.moves > 0) {
            child = <Unit {...unit} />;
          } else {
            child = <UnitCardView {...unit} />;
          }

          return (
            <DropPosition
              key={position}
              width={width}
              onDrop={({ card }) => onAddUnit({ card, position })}
            >
              {child}
            </DropPosition>
          );
        })}
      </div>
    );
  }
}
