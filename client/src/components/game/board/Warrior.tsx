import * as React from "react";

interface PropTypes {
  type: string;
  health: number;
  damage: number;
}

export default function Warrior({ type, health, damage }: PropTypes) {
  return (
    <div id="warrior_on_field">
      <strong className="primary-font">{type}</strong>
      <small className="float-right text-muted">
        {health} / {damage}
      </small>
    </div>
  );
}
