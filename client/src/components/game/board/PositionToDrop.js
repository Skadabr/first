import React from "react";
import PropTypes from "prop-types";
import { DropTarget } from "react-dnd";
import { DragTypes } from "../../../constants";

export class PositionToDrop extends React.Component {
  render() {
    const { children, canDrop, isOver, connectDropTarget } = this.props;
    const width = (this.props.width | 0) + "%";
    //const isActive = canDrop && isOver;

    return connectDropTarget(
      <div style={{ maxWidth: width, minWidth: width, minHeight: 40 }}>
        {children}
      </div>
    );
  }
}

PositionToDrop.propTypes = {
  connectDropTarget: PropTypes.func.isRequired,
  isOver: PropTypes.bool.isRequired,
  canDrop: PropTypes.bool.isRequired,
  width: PropTypes.number.isRequired
};

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
