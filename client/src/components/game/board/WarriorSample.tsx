import * as React from "react";
import { DragSource } from "react-dnd";
import { DragTypes, WarriorKinds } from "../../../constants";
import warrior_samples from "../../../warrior_samples";

const WarriorTypes = {
  [WarriorKinds.PAWN]: "Pawn",
  [WarriorKinds.OFFICER]: "Officer"
};

export interface WarriorSample {
  kind: WarriorKinds;
  health: number;
  damage: number;
  price: number;
}

interface Draggable {
  connectDragSource: Function;
  isDragging: boolean;
}

type PropTypes = Draggable & WarriorSample;

export class WarriorSample extends React.Component<PropTypes> {
  render() {
    const { kind, isDragging, connectDragSource } = this.props;
    const opacity = isDragging ? 0.4 : 1;
    const { name, health, damage, price } = warrior_samples.find(
      w => w.kind === kind
    );

    return connectDragSource(
      <div
        style={{
          maxWidth: 80,
          border: "1px solid black",
          minWidth: 80,
          minHeight: 120
        }}
      >
        <strong className="primary-font">{name}</strong>
        <small className="float-right text-muted">
          {health} / {damage} - price({price})
        </small>
      </div>
    );
  }
}

const warriorSource = {
  beginDrag({ kind }) {
    return { kind };
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
