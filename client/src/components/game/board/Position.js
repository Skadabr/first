import React from "react";
import PropTypes from "prop-types";

import Warrior from "./Warrior";
import { WarriorType } from "../types";

export default function Position({ width, warrior }) {
  width = (width | 0) + "%";
  return (
    <div style={{ maxWidth: width, minWidth: width }}>
      {warrior ? <Warrior {...warrior} /> : null}
    </div>
  );
}

Position.propTypes = {
  width: PropTypes.number.isRequired,
  warrior: WarriorType,
}
