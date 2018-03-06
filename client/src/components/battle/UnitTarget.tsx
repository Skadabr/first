import React from "react";
import { DropTarget } from "react-dnd";

import { DragTypes, POSITION_MIN_WIDTH, CARD_HEIGHT } from "../../constants";
import UnitCardView from "./UnitCardView";

export class UnitTarget extends React.PureComponent<any> {
  render() {
    const { unit, onDrop, connectDropTarget } = this.props;
    //const isActive = canDrop && isOver;
    return connectDropTarget(
      <div>
        <UnitCardView {...unit} available={true} />
      </div>
    );
  }
}

const dropTarget = {
  drop({ onDrop, unit }, monitor) {
    console.log("UnitTarget->drop");
    onDrop({ unit_id: monitor.getItem().unit_id, target_id: unit._id });
  },

  hover() {
    console.log("UnitTarget->hover");
  }
};

export default DropTarget(DragTypes.UNIT, dropTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  canDrop: monitor.canDrop()
}))(UnitTarget as any);
