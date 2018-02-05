import React from "react";

export default function Warrior({ type, health, damage }) {
  return (
    <div id="warrior_on_field">
      <strong className="primary-font">{type}</strong>
      <small className="float-right text-muted">
        {health} / {damage}
      </small>
    </div>
  );
}
