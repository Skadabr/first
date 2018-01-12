import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import {
  loadOpponents,
} from "../../actions/chat";

class Opponents extends React.Component {
  async componentDidMount() {
    const {
      loadOpponents,
      name
    } = this.props;
    await loadOpponents();
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
