import React from "react";
import { connect } from "react-redux";

import { signup, login, logout } from "../../state/user.state";

import SignupForm from "./SignupForm";
import LoginForm from "./LoginForm";

class Auth extends React.Component {
  render() {
    return (
      <div>
        <SignupForm submit={this.props.signup} />
        <LoginForm submit={this.props.login} />
      </div>
    );
  }
}

export default connect(undefined, { signup, login })(Auth);
