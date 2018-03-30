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
  beginDrag(props) {
    console.log("Unit->beginDrag");
    props.onBeginDrag(props.unit._id);
    return { sourceId: props.unit._id };
  },

  endDrag(props, monitor) {
    console.log("Unit->endDrag");
    props.onEndDrag(props.unit._id, monitor.didDrop());

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
