import React from "react";
import PropTypes from "prop-types";

import { WarriorType } from "../types";

export default function Warrior({ type, damage, health }) {
  return (
    <div id="warrior_on_field">
      <strong className="primary-font">{type}</strong>
      <small className="float-right text-muted">
        {health} / {damage}
      </small>
    </div>
  );
}

Warrior.propTypes = {
  ...WarriorType
};
