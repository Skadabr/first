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
    const { messages } = this.props;
    return (
      <div ref={el => (this.board = el)}>
        {messages.length > 0 &&
          messages.map((msg, i) => (
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
  messages: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.object)).isRequired
};
