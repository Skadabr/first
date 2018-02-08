import React from "react";
import { POSITIONS } from "../../../constants";

import Warrior from "./Warrior";

interface PropTypes {
  owner_name: string;
  warriors: any[];
  submit: Function;
  box: any;
}

export default function Positions({
  owner_name,
  warriors,
  submit,
  box: Position
}: PropTypes) {
  const width = 100 / POSITIONS;
  return (
    <div
      className="card-block"
      style={{ display: "flex", flexDirection: "row" }}
    >
      {[...positions()].map(position => {
        const w = warriors.find(w => w.position === position);
        return (
          <Position
            key={position}
            width={width}
            onDrop={warrior => submit({ owner_name, position, warrior })}
          >
            {w != null ? <Warrior {...w} /> : null}
          </Position>
        );
      })}
    </div>
  );
}

function* positions() {
  for (let i = 0; i < POSITIONS; i++) yield i;
}
