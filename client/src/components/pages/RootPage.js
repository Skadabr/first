import React from "react";
import { connect } from "react-redux";

import { signup } from "../../actions/user";
import { login } from "../../actions/auth";

import SignupForm from "../forms/SignupForm";
import LoginForm from "../forms/LoginForm";

class RootPage extends React.Component {
  render() {
    return (
      <div>
        <div className="col-8 offset-4">
          <SignupForm submit={this.props.signup} />
          <LoginForm submit={this.props.login} />
        </div>
      </div>
    );
  }
}

export default connect(undefined, { signup, login })(RootPage);
