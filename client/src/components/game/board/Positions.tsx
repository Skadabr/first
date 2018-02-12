import React from "react";
import { POSITIONS, WarriorKinds } from "../../../constants";

import Warrior from "./Warrior";

const positions = [...getPositions()];

interface PositionsPropTypes {
  owner_name: string;
  warriors: any[];
  submit: Function;
  box: any;
}

export default class Positions extends React.PureComponent<PositionsPropTypes> {
  render() {
    const { owner_name, warriors, submit, box: Position } = this.props;
    const width = ( 100 / POSITIONS ) | 0;
    return (
      <div
        className="card-block"
        style={{ display: "flex", flexDirection: "row", maxHeight: "auto" }}
      >
        {positions.map(position => {
          const w = warriors.find(w => w.position === position);
          return (
            <Position
              key={position}
              width={width}
              onDrop={({ kind }: { kind: WarriorKinds }) =>
                submit({ owner_name, position, warrior: {kind} })
              }
            >
              {w != null ? <Warrior {...w} /> : null}
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
