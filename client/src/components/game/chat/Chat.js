import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import MessageBoard from "./MessageBoard";
import MessageInput from "./MessageInput";
import ChatHeader from "./ChatHeader";
import { sendMessage } from "../../../state/game_chat.state";

class Chat extends React.Component {
  onMessage = msg => {
    const { sendMessage, name } = this.props;
    sendMessage(msg, name, new Date());
  };

  render() {
    const { messages, show_chat } = this.props;

    if (!show_chat) return null;

    return (
      <div className="card">
        <div className="card-header">
          <ChatHeader />
        </div>
        <div className="card-body">
          <MessageBoard messages={messages} />
        </div>
        <div className="card-footer">
          <MessageInput submit={this.onMessage} />
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    messages: state.game_chat,
    show_chat: state.game.show_chat,
    name: state.user.name
  };
}

export default connect(mapStateToProps, {
  sendMessage
})(Chat);
