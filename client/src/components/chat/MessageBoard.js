import React from "react";
import PropTypes from "prop-types";
import m from "moment";

export default class MessageBoard extends React.Component {
  componentDidUpdate() {
    const { board } = this;
    if (board.children.length > 0) {
      board.scrollTop = board.lastChild.offsetTop;
    }
  }

  render() {
    const { msgs } = this.props;
    return (
      <div id="board" ref={el => (this.board = el)}>
        {msgs.length > 0 &&
          msgs.map((msg, i) => (
            <div key={i}>
              <div className="ChatMessage">
                <span className="ChatMessageName">{msg.user}:</span>
                <span className="ChatMessageCreated">{m(msg.created).fromNow()}</span>
                <span className="ChatMessageContent">{msg.msg}</span>
              </div>
            </div>
          ))}
      </div>
    );
  }
}

MessageBoard.propTypes = {
  msgs: PropTypes.arrayOf(PropTypes.string).isRequired
};
