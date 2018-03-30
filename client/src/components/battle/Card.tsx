import React from "react";
import { DragSource } from "react-dnd";

import { DragTypes } from "../../constants";
import UnitCardView from "./UnitCardView";

const numberStyle = {
  paddingLeft: "0.2rem",
  paddingRight: "0.2rem"
};

class Card extends React.PureComponent<any> {
  // former DragUnit
  render() {
    return this.props.connectDragSource(
      <div>
        <UnitCardView {...this.props.card.unit} />
      </div>
    );
  }
}

const cardSource = {
  beginDrag(props) {
    return { card: props.card };
  },

  endDrag(props, monitor) {
    console.log("Card->endDrag");
    const item = monitor.getItem();
    const dropResult = monitor.getDropResult();
    if (dropResult) {
      console.log(
        `Card->endDrag: You dropped ${item.card.type}:${
          item.card._id
        } into ${JSON.stringify(dropResult)}!`
      );
    }

  }
};

export default DragSource(DragTypes.CARD, cardSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging()
}))(Card as any);
