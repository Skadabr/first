import React from "react";
import { DragSource } from "react-dnd";

import { DragTypes } from "../../constants";
import UnitCardView from "./UnitCardView";

class Unit extends React.PureComponent<any> {
  render() {
    return this.props.connectDragSource(
      <div>
        <UnitCardView {...this.props} />
      </div>
    );
  }
}

const unitSource = {
  beginDrag({ type }) {
    return { type };
  },

  endDrag(props, monitor) {
    console.log("Unit->endDrag");
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
}))(Unit as any);
