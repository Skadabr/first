import * as React from "react";
import { DragSource } from "react-dnd";
import {
  DragTypes,
  WarriorKinds,
  CARD_WIDTH,
  CARD_HEIGHT
} from "../../../constants";
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

const numberStyle = {
  paddingLeft: "0.2rem",
  paddingRight: "0.2rem"
};

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
          maxWidth: CARD_WIDTH,
          minWidth: CARD_WIDTH,
          maxHeight: CARD_HEIGHT,
          minHeight: CARD_HEIGHT,
          border: "1px solid gray",
          position: "relative",
          display: "flex",
          flexDirection: "column"
        }}
      >
        <div>
          <small className="text-muted" style={numberStyle}>
            {health}
          </small>
          <small className="text-muted" style={{ numberStyle, float: "right" }}>
            {damage}
          </small>
        </div>
        <div
          style={{
            paddingTop: "2rem",
            marginBottom: "auto",
            textAlign: "center"
          }}
        >
          <strong className="primary-font">{name}</strong>
        </div>
        <div>
          <small className="float-left text-muted" style={numberStyle}>
            {price}
          </small>
        </div>
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
