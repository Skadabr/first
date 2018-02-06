import React from "react";

import { POSITIONS } from "../../../constants";

import Warrior from "./Warrior";

export default function Positions({
  owner_name,
  warriors,
  submit,
  box: Position
}) {
  const width = 100 / POSITIONS;
  return (
    <div
      className="card-block"
      style={{ display: "flex", flexDirection: "row" }}
    >
      {[...positions()].map((w, i) => {
        w = warriors.find(w => w.position === i);
        return (
          <Position
            key={i}
            width={width}
            onDrop={warrior => submit({ owner_name, position: i, warrior })}
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
