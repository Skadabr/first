import React from "react";

import {
  UnitTypes,
  CARD_WIDTH,
  CARD_HEIGHT,
  POSITION_MIN_WIDTH
} from "../../constants";
import { createUnit } from "../../lib/unit/";

const numberStyle = {
  paddingLeft: "0.2rem",
  paddingRight: "0.2rem"
};

export default class UnitCardView extends React.PureComponent<any> {
  render() {
    const { type, health, owner_id, availability, active, moves } = this.props;
    const { damage, name, cost } = createUnit(type, { owner_id });

    let border = "1px solid gray";
    if (moves > 0) border = "1px solid yellow";
    if (availability > 0) border = "1px solid blue";
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
            {damage}
          </small>
          <small className="text-muted" style={{ numberStyle, float: "right" }}>
            {health}
          </small>
        </div>
      </div>
    );
  }
}
