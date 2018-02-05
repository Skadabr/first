import React from "react";
import PropTypes from "prop-types";
import { DropTarget } from "react-dnd";
import { DragTypes } from "../../../constants";

import Warrior from "./Warrior";

export class Position extends React.Component {
  render() {
    const { warrior, canDrop, isOver, connectDropTarget } = this.props;
    const isActive = canDrop && isOver;
    const width = (this.props.width | 0) + "%";

    //	return (
    //		<div style={{ ...style, backgroundColor }}>
    //			{isActive ? 'Release to drop' : 'Drag a box here'}
    //		</div>,
    //	)
    return connectDropTarget(
      <div style={{ maxWidth: width, minWidth: width, minHeight: 40 }}>
        {warrior != null && <Warrior {...warrior} />}
      </div>
    );
  }
}

Position.propTypes = {
  connectDropTarget: PropTypes.func.isRequired,
  isOver: PropTypes.bool.isRequired,
  canDrop: PropTypes.bool.isRequired,
  width: PropTypes.number.isRequired
};

const warriorTarget = {
  drop() {
    return { name: "Dustbin" };
  }
};

export default DropTarget(
  DragTypes.WARRIOR,
  warriorTarget,
  (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop()
  })
)(Position);
