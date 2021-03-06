import React from "react";
import { connect } from "react-redux";

import { signup, login } from "../../actions/auth";

import SignupForm from "./SignupForm";
import LoginForm from "./LoginForm";

class Auth extends React.Component<any, any> {
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
