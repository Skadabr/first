import React from "react";
import { DropTarget } from "react-dnd";
import { DragTypes } from "../../../constants";

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
  const width_in_percents = (width + "").substr(0, 3) + "%";
  //const isActive = canDrop && isOver;

  return connectDropTarget(
    <div
      style={{
        border: "1px solid black",
        maxWidth: width_in_percents,
        minWidth: width_in_percents,
        minHeight: 100
      }}
    >
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
