import React from "react";
import { DropTarget } from "react-dnd";
import { DragTypes } from "../../../constants";

interface PropTypes {
  connectDropTarget: Function;
  isOver: boolean;
  canDrop: boolean;
  width: number;
}

export function PositionToDrop({
  children,
  canDrop,
  isOver,
  connectDropTarget,
  width
}: PropTypes) {
  width = (width | 0) + "%";
  //const isActive = canDrop && isOver;

  return connectDropTarget(
    <div style={{ maxWidth: width, minWidth: width, minHeight: 40 }}>
      {children}
    </div>
  );
}

const dropTarget = {
  drop({ onDrop }, monitor) {
    onDrop(monitor.getItem());
  }
};

export default DropTarget(
  DragTypes.WARRIOR,
  dropTarget,
  (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop()
  })
)(PositionToDrop);
