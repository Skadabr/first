//import React from "react";
//import { connect } from "react-redux";
//
//import { playerDeckSelector } from "../../selectors/battle";
//import Card from "./Card";
//
//interface DeckEditorState {
//  deck: any;
//}
//
//export default class DeckEditor extends React.Component<any, DeckEditorState> {
//  constructor(props) {
//    super(props);
//    this.state = {
//      deck: props.deck.map(card => ({ ...card, active: true }))
//    };
//  }
//  render() {
//    const { deck } = this.state;
//    return (
//      <div>
//        {deck.map(card => {
//          <Card card={card} />;
//        })}
//      </div>
//    );
//  }
//}
//
//function mapStateToProps(state) {
//  return {
//    deck: deckSelector(state)
//  };
//}
//
//connect();
