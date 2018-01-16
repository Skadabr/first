import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import MessageBoard from "./MessageBoard";
import MessageInput from "./MessageInput";
import {
  sendMessage,
} from "../../state/game_chat";

class Chat extends React.Component {
  onMessage = msg => {
    this.props.sendMessage(msg, this.props.name);
  };

  render() {
    const { messages } = this.props;

    return (
      <div className="card">
        <div className="card-body">
          <div id="chat" className="Chat row">
            <div className="ChatIO col-12 col-sm-9">
              <MessageBoard messages={messages} />
              <MessageInput submit={this.onMessage} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    messages: state.game_chat.messages,
    name: state.user.name
  };
}

export default connect(mapStateToProps, {
  sendMessage,
  loadMessages,
  userOnline,
  loadChatUsers,
  userOffline
})(Chat);
