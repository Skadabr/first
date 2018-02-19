import React from "react";
import { POSITIONS, UnitTypes } from "../../constants";

import Unit from "./Unit";

const positions = [...getPositions()];

interface PositionsPropTypes {
  owner_name: string;
  units: any[];
  submit: Function;
  box: any;
}

export default class Positions extends React.PureComponent<PositionsPropTypes> {
  render() {
    const { owner_name, units, submit, box: Position } = this.props;
    const width = (100 / POSITIONS) | 0;
    return (
      <div
        className="card-block"
        style={{ display: "flex", flexDirection: "row", maxHeight: "auto" }}
      >
        {positions.map(position => {
          const u = units.find(u => u.position === position);
          return (
            <Position
              key={position}
              width={width}
              onDrop={({ type }: { type: UnitTypes }) =>
                submit({ owner_name, position, unit: { type } })
              }
            >
              {u != null ? <Unit {...u} /> : null}
            </Position>
          );
        })}
      </div>
    );
  }
}

function* getPositions() {
  for (let i = 0; i < POSITIONS; i++) yield i;
}
