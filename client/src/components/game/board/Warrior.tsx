import React from "react";

import { WarriorKinds } from "../../../constants";

const WarriorKindToString = {
  [WarriorKinds.PAWN]: "Pawn",
  [WarriorKinds.OFFICER]: "Officer"
};

interface WarriorPropTypes {
  kind: WarriorKinds;
  health: number;
  damage: number;
}

export default function Warrior({ kind, health, damage }: WarriorPropTypes) {
  return (
    <div id="warrior_on_field">
      <strong className="primary-font">{WarriorKindToString[kind]}</strong>
      <small className="float-right text-muted">
        {health} / {damage}
      </small>
    </div>
  );
}
