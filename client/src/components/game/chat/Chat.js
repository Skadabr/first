import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import MessageBoard from "./MessageBoard";
import MessageInput from "./MessageInput";
import ChatHeader from "./ChatHeader";
import { sendMessage } from "../../../actions/battle";

import { chatMessagesSelector} from "../../../selectors/game_chat"
import { userInfoSelector} from "../../../selectors/user"


class Chat extends React.Component {
  onMessage = msg => {
    const { sendMessage, name } = this.props;
    sendMessage(msg, name, new Date());
  };

  render() {
    const { messages } = this.props;

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
    messages: chatMessagesSelector(state),
    name: userInfoSelector(state).name
  };
}

export default connect(mapStateToProps, {
  sendMessage
})(Chat);
