import React from "react";
import { Route, Redirect } from "react-router-dom";
import { Component, connect } from "react-redux";
import { isAuthenticated } from "../../selectors/user";

interface UserRoutePT {
  isAuthenticated: boolean;
  component: any;
  path: string;
  exact?: boolean;
}

class UserRoute extends React.Component<UserRoutePT> {
  render() {
    const { isAuthenticated, component: Component, ...rest } = this.props;

    return (
      <Route
        {...rest}
        render={props =>
          isAuthenticated ? <Component {...props} /> : <Redirect to="/" />
        }
      />
    );
  }
}

function mapStateToProps(state) {
  return {
    isAuthenticated: isAuthenticated(state)
  };
}

export default connect(mapStateToProps, undefined, undefined, { pure: false })(
  UserRoute
);
