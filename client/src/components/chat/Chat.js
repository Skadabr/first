import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import MessageBoard from "./MessageBoard";
import MessageInput from "./MessageInput";
import ChatUsersList from "./ChatUsersList";
import ChatHeader from "./ChatHeader";
import {
  sendMessage,
  loadMessages,
  loadChatUsers,
  userOnline,
  userOffline
} from "../../actions/chat";

import "../../css/Chat.css";

class Chat extends React.Component {
  async componentDidMount() {
    const {
      loadMessages,
      loadChatUsers,
      userOnline,
      userOffline,
      name
    } = this.props;
    await loadMessages();
    await loadChatUsers();
    userOnline(name);
    window.onbeforeunload = userOffline.bind(null, name);
  }

  componentWillUnmount() {
    const { userOffline, name } = this.props;
    userOffline(name);
  }

  onMessage = msg => {
    this.props.sendMessage(msg, this.props.name);
  };

  render() {
    const { msgs, users } = this.props;

    return (
      <div className="card">
        <div className="card-header">
          <ChatHeader />
        </div>
        <div className="card-body">
          <div id="chat" className="Chat row">
            <div className="ChatUsersList col-12 col-sm-3">
              <ChatUsersList users={users} />
            </div>
            <div className="ChatIO col-12 col-sm-9">
              <MessageBoard msgs={msgs} />
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
    msgs: state.chat_messages,
    name: state.user.name,
    users: state.chat_users
  };
}

export default connect(mapStateToProps, {
  sendMessage,
  loadMessages,
  userOnline,
  loadChatUsers,
  userOffline
})(Chat);
