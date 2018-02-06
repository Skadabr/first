import React from "react";
import PropTypes from "prop-types";
import { DragSource } from "react-dnd";
import { DragTypes } from "../../../constants";

import { WarriorType } from "../types";

export class WarriorSample extends React.Component {
  render() {
    const {
      type,
      damage,
      health,
      price,
      isDragging,
      connectDragSource
    } = this.props;
    const opacity = isDragging ? 0.4 : 1;

    return connectDragSource(
      <div>
        <strong className="primary-font">
          {type[0].toUpperCase() + type.slice(1)}
        </strong>
        <small className="float-right text-muted">
          {health} / {damage} - price({price})
        </small>
      </div>
    );
  }
}

WarriorSample.propTypes = {
  ...WarriorType,
  connectDragSource: PropTypes.func.isRequired,
  isDragging: PropTypes.bool.isRequired
};

const warriorSource = {
  beginDrag({ type, price }) {
    return { type, price };
  },

  endDrag(props, monitor) {
    const item = monitor.getItem();
    const dropResult = monitor.getDropResult();

    if (dropResult) {
      alert(`You dropped ${item.type} into ${JSON.stringify(dropResult, undefined, 3)}!`); // eslint-disable-line no-alert
    }
  }
};

export default DragSource(
  DragTypes.WARRIOR,
  warriorSource,
  (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  })
)(WarriorSample);
