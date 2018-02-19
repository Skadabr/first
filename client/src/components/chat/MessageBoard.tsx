import React from "react"
import m from "moment";

import { ChatState } from "../../actions/chat"

interface PropTypes {
  messages: ChatState;
}

export default class MessageBoard extends React.Component<PropTypes> {
  private board: any;

  componentDidUpdate() {
    const { board } = this;
    if (board.children.length > 0) {
      board.scrollTop = board.lastChild.offsetTop;
    }
  }

  render() {
    const { messages } = this.props;
    return (
      <ul id="message_board" className="Chat" ref={el => (this.board = el)}>
        {messages.length > 0 &&
          messages.map((msg, i) => (
            <li id="chat_message" className="card-block" key={i}>
              <div className="chat-body">
                <div className="header">
                  <strong className="primary-font">{msg.name}</strong>
                  <small className="float-right text-muted">
                    {m(msg.date).fromNow()}
                  </small>
                </div>
                <p>{msg.msg}</p>
              </div>
            </li>
          ))}
      </ul>
    );
  }
}

//MessageBoard.propTypes = {
//  messages: PropTypes.arrayOf(PropTypes.object).isRequired
//};
