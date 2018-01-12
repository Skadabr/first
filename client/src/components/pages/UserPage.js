import React from "react";
import { connect } from "react-redux";

import Opponents from "../opponents/Opponents";
import UserInfo from "../user/UserInfo";

class UserPage extends React.Component {
  render() {
    const { name, email } = this.props;

    return (
      <div className="row">
        <div className="col-12 col-sm-3">
          <UserInfo name={name} email={email} />
        </div>
        <div className="col-12 col-sm-9">
          <Opponents />
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { name, email } = state.user;
  return { name, email };
}

export default connect(mapStateToProps)(UserPage);
