import React from "react";

import {
  WarriorKinds,
  CARD_WIDTH,
  CARD_HEIGHT,
  POSITION_MIN_WIDTH
} from "../../../constants";
import warrior_samples from "../../../warrior_samples";

const numberStyle = {
  paddingLeft: "0.2rem",
  paddingRight: "0.2rem"
};

interface WarriorPropTypes {
  kind: WarriorKinds;
  health: number;
  damage: number;
}

export default function Warrior({ kind, health }: WarriorPropTypes) {
  const { damage, name, price } = warrior_samples.find(w => w.kind === kind);
  return (
    <div
      id="warrior_on_field"
      style={{
        maxWidth: CARD_WIDTH,
        minWidth: CARD_WIDTH,
        minHeight: CARD_HEIGHT,
        maxHeight: CARD_HEIGHT,
        border: "1px solid gray",
        position: "relative",
        display: "flex",
        flexDirection: "column"
      }}
    >
      <div>
        <small className="float-left text-muted" style={numberStyle}>
          {price}
        </small>
      </div>
      <div
        style={{
          paddingTop: "2rem",
          marginBottom: "auto",
          textAlign: "center"
        }}
      >
        <strong className="primary-font">{name}</strong>
      </div>
      <div>
        <small className="text-muted" style={numberStyle}>
          {damage}
        </small>
        <small className="text-muted" style={{ numberStyle, float: "right" }}>
          {health}
        </small>
      </div>
    </div>
  );
}
