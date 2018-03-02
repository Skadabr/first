import React from "react";
import { DragSource } from "react-dnd";

import { DragTypes } from "../../constants";
import UnitCardView from "./UnitCardView";

class Unit extends React.PureComponent<any> {
  render() {
    const { unit, connectDragSource } = this.props;

    return connectDragSource(
      <div>
        <UnitCardView {...unit} />
      </div>
    );
  }
}

const unitSource = {
  beginDrag({ onBeginDrag, unit }) {
    console.log("Unit->beginDrag");
    onBeginDrag(unit._id);
    return { unit_id: unit._id };
  },

  endDrag({ onEndDrag, unit }, monitor) {
    console.log("Unit->endDrag");
    onEndDrag(unit._id, monitor.didDrop());

    //  const item = monitor.getItem();
    //  const dropResult = monitor.getDropResult();

    //if (dropResult) {
    //  alert(`You dropped ${item.type} into ${JSON.stringify(dropResult, undefined, 3)}!`); // eslint-disable-line no-alert
    //}
  }
};

export default DragSource(DragTypes.UNIT, unitSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging()
}))(Unit as any);
