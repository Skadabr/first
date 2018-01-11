import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import {
  userOnline,
  userOffline
} from "../../actions/chat";

class ChatHeader extends React.Component {
  render() {
    const {online, userOnline, userOffline} = this.props;

    return (
        <div>
          <div>Chat</div>
          <div className="UserStatus">
            {online ? "online" : "offline"}
          </div>
        </div>
    );
  }
}

ChatHeader.propTypes = {
};

function mapStateToProps(state) {
  return {
    name: state.user.online,
  };
}

export default connect(mapStateToProps, {
  userOnline,
  userOffline
})(ChatHeader);
