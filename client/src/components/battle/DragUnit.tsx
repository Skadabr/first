import React from "react";
import { DragSource } from "react-dnd";

import { DragTypes } from "../../constants";
import Unit from "./Unit";

import {
  UnitTypes,
  CARD_WIDTH,
  CARD_HEIGHT,
  POSITION_MIN_WIDTH
} from "../../constants";
import { createUnit } from "../../unit/";

const numberStyle = {
  paddingLeft: "0.2rem",
  paddingRight: "0.2rem"
};

class DragUnit extends React.PureComponent<any> {
  render() {
    return this.props.connectDragSource(
      <div>
        <Unit {...this.props} />
      </div>
    );
  }
}

const unitSource = {
  beginDrag({ type }) {
    return { type };
  },

  endDrag(props, monitor) {
    const item = monitor.getItem();
    const dropResult = monitor.getDropResult();

    //if (dropResult) {
    //  alert(`You dropped ${item.type} into ${JSON.stringify(dropResult, undefined, 3)}!`); // eslint-disable-line no-alert
    //}
  }
};

export default DragSource(DragTypes.UNIT, unitSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging()
}))(DragUnit as any);
