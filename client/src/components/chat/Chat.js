import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import MessageBoard from "./MessageBoard";
import MessageInput from "./MessageInput";
import { sendMessage, loadMessages} from "../../actions/chat";

class Chat extends React.Component {
  componentDidMount() {
    this.props.loadMessages();
  }

  onMessage = msg => {
    this.props.sendMessage(msg, this.props.name);
  }

  render() {
    const {msgs, sendMessage, loadMessages } = this.props;

    return (
      <div id="chat" className="card" style={{ padding: 10 }}>
        <div className="card-header">
          Users chat
        </div>
        <div className="card-body">
          <MessageBoard msgs={msgs} />
        </div>
        <MessageInput submit={this.onMessage} />
      </div>
    );
  }
}

function mapStateToProps(state) {
  const len = state.chat_messages.length;
  return {
    msgs: state.chat_messages.slice(len-10, len),
    name: state.user.name
  }
}

export default connect(mapStateToProps, { sendMessage, loadMessages })(Chat);
