import React from "react";

import Card from "./Card";
import { UnitCharacteristic } from "../../lib/unit";

export default class Deck extends React.PureComponent<any> {
  render() {
    const deck = this.props.deck;

    return (
      <div
        id="warrior_samples"
        style={{ display: "flex", flexDirection: "row" }}
      >
        {deck.map(card => {
          return (
            <div key={card._id}>
              <Card card={card} />
            </div>
          );
        })}
      </div>
    );
  }
}
