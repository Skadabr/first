import React from "react";

import DragUnit from "./DragUnit";
import { UnitBasicCharacteristic } from "../../unit";

export default class Deck extends React.PureComponent<any> {
  render() {
    return (
      <div
        id="warrior_samples"
        style={{ display: "flex", flexDirection: "row" }}
      >
        {Object.keys(UnitBasicCharacteristic).map(key => {
          const type = parseInt(key);
          return (
            <div key={type}>
              <DragUnit type={type} />
            </div>
          );
        })}
      </div>
    );
  }
}
