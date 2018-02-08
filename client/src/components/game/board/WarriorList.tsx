import React from "react";

import WarriorSample from "./WarriorSample";
import warrior_samples from "../../../warrior_samples";


export default class WarriorList extends React.Component {
  render() {
    return (
      <div id="warrior_samples">
        {Object.keys(warrior_samples).map(kind => (
          <div
            key={kind}
            className="card-block"
          >
            <WarriorSample kind={kind} />
          </div>
        ))}
      </div>
    );
  }
}
