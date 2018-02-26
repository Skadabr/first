import React from "react";
import { DropTarget } from "react-dnd";

import { DragTypes } from "../../constants";
import UnitCardView from "./UnitCardView";

class TargetUnit extends React.PureComponent<any> {
  render() {
    return this.props.connectDragSource(
      <div>
        <UnitCardView {...this.props} />
      </div>
    );
  }
}

const dropTarget = {
  drop({ onDrop }, monitor) {
    console.log("TargetUnit->drop");
    onDrop(monitor.getItem());
  }
};

export default DropTarget(DragTypes.UNIT, dropTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  canDrop: monitor.canDrop()
}))(TargetUnit as any);
