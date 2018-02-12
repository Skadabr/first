import React from "react";

import WarriorSample from "./WarriorSample";
import warrior_samples from "../../../warrior_samples";

export default class WarriorList extends React.Component {
  render() {
    return (
      <div
        id="warrior_samples"
        style={{ display: "flex", flexDirection: "row" }}
      >
        {warrior_samples.map(sample => (
          <div key={sample.kind}>
            <WarriorSample kind={sample.kind} />
          </div>
        ))}
      </div>
    );
  }
}
