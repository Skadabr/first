import React from "react";

import WarriorSample from "./WarriorSample";
import warriors_list from "../../../utils/warriors_list";


export default class WarriorList extends React.Component {
  render() {
    return (
      <div id="warriors_list">
        {warriors_list.map((w, i) => (
          <div
            key={i}
            className="card-block"
          >
            <WarriorSample {...w} />
          </div>
        ))}
      </div>
    );
  }
}
