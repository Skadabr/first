import React from "react";
import { connect } from "react-redux";

import Chat from "../chat/Chat";
import { logout } from "../../actions/auth";

class UserPage extends React.Component {
  render() {
    const { name, email } = this.props;

    return (
      <div className="row">
        <div className="col-3">
          <div>Name: {name}</div>
          <div>Email: {email}</div>
          <button type="button" onClick={this.props.logout}>
            Logout
          </button>
        </div>
        <div className="col-9">
          <Chat />
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { name, email } = state.user;
  return { name, email };
}

export default connect(mapStateToProps, { logout })(UserPage);
