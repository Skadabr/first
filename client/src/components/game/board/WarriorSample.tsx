import * as React from "react"
import { DragSource } from "react-dnd";
import { DragTypes, WarriorKinds } from "../../../constants";

export interface WarriorSample {
  type: WarriorKinds;
  health: number;
  damage: number;
  price: number;
}


interface Draggable {
  connectDragSource: Function;
  isDragging: boolean;
}

type PropTypes = Draggable & WarriorType;

export class WarriorSample extends React.Component<PropTypes> {
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

//WarriorSample.propTypes = {
//};

const warriorSource = {
  beginDrag({ type, price }) {
    return { type, price };
  },

  endDrag(props, monitor) {
    const item = monitor.getItem();
    const dropResult = monitor.getDropResult();

    //if (dropResult) {
    //  alert(`You dropped ${item.type} into ${JSON.stringify(dropResult, undefined, 3)}!`); // eslint-disable-line no-alert
    //}
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
