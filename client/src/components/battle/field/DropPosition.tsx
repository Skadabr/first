import React from "react";
import { DropTarget } from "react-dnd";

import { DragTypes, POSITION_MIN_WIDTH, CARD_HEIGHT } from "../../../constants";

interface PropTypes {
  connectDropTarget: Function;
  isOver: boolean;
  canDrop: boolean;

  width: number;
  children: any;
  onDrop: Function;
}

export function PositionToDrop({
  children,
  canDrop,
  isOver,
  connectDropTarget,
  width
}: PropTypes) {
  //const isActive = canDrop && isOver;

  return connectDropTarget(<Position width={width}>{children}</Position>);
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
