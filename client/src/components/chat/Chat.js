import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import MessageBoard from "./MessageBoard";
import MessageInput from "./MessageInput";
import ChatUsersList from "./ChatUsersList";
import { sendMessage, loadMessages, loadChatUsers, userOnline, userOffline } from "../../actions/chat";

import "../../css/Chat.css";

class Chat extends React.Component {
  async componentDidMount() {
    const {loadMessages, loadChatUsers, userOnline, userOffline, name} = this.props;
    await loadMessages();
    await loadChatUsers();
    userOnline(name);
    window.onbeforeunload = (userOffline.bind(null, name));
  }

  componentWillUnmount() {
    const { userOffline, name} = this.props;
    userOffline(name);
  }

  onMessage = msg => {
    this.props.sendMessage(msg, this.props.name);
  };

  render() {
    const { msgs, sendMessage, loadMessages, users } = this.props;

    return (
      <div className className="card">
        <div className="card-header">Users chat</div>
        <div className="card-body">
          <div id="chat" className="Chat row">
            <div className="ChatIO col-9">
              <MessageBoard msgs={msgs} />
              <MessageInput submit={this.onMessage} />
            </div>
            <div className="ChatUsersList col-3">
              <ChatUsersList users={users}></ChatUsersList>
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
