import React from "react";

import {POSITION_MIN_WIDTH, CARD_HEIGHT} from "../../../constants";

interface PropTypes {
  width: number;
  children: React.Component;
}

export default function Position({ children, width }: PropTypes) {

  //const width_in_percents = (width + "").substr(0, 3) + "%";
  const width_in_percents = width + "%";

  return (
    <div
      style={{
        width: width_in_percents,
        minWidth: POSITION_MIN_WIDTH,
        minHeight: CARD_HEIGHT,
      }}
    >
      {children}
    </div>
  );
}
