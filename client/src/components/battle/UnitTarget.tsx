import React from "react";
import { DropTarget } from "react-dnd";

import { DragTypes, POSITION_MIN_WIDTH, CARD_HEIGHT } from "../../constants";
import UnitCardView from "./UnitCardView";

export class UnitTarget extends React.PureComponent<any> {
  render() {
    //const isActive = canDrop && isOver;
    return this.props.connectDropTarget(
      <div>
        <UnitCardView {...this.props} />
      </div>
    );
  }
}

const dropTarget = {
  drop({ onDrop }, monitor) {
    console.log("UnitTarget->drop");
    onDrop(monitor.getItem());
  }
};

export default DropTarget(DragTypes.UNIT, dropTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  canDrop: monitor.canDrop()
}))(UnitTarget as any);
