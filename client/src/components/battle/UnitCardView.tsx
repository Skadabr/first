import React from "react";

import { CARD_WIDTH, CARD_HEIGHT, POSITION_MIN_WIDTH } from "../../constants";
import { UnitTypes } from "core";

const numberStyle = {
  paddingLeft: "0.2rem",
  paddingRight: "0.2rem"
};

export default class UnitCardView extends React.PureComponent<any> {
  render() {
    const { unit, available, active } = this.props;
    const { attack, name, cost, type, health, owner_id, moves } = unit;

    let border = "1px solid gray";
    if (moves > 0) border = "1px solid yellow";
    // if (available) border = "1px solid blue";
    if (active) border = "1px solid red";

    return (
      <div
        className="Unit"
        style={{
          maxWidth: CARD_WIDTH,
          minWidth: CARD_WIDTH,
          minHeight: CARD_HEIGHT,
          maxHeight: CARD_HEIGHT,
          border,
          position: "relative",
          display: "flex",
          flexDirection: "column",
          cursor: "pointer"
        }}
      >
        <div>
          <small className="float-left text-muted" style={numberStyle}>
            {cost}
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
            {attack}
          </small>
          <small className="text-muted" style={{ numberStyle, float: "right" }}>
            {health}
          </small>
        </div>
      </div>
    );
  }
}
