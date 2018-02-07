import React from "react";
import { Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";

import { isAuthenticatedSelector } from "../../selectors/user";

interface PropTypes {
  isAuthenticated: boolean;
  component: React.Component;
  path: string;
  exact: boolean;
}

function User({ isAuthenticated, component: Component, ...rest }: PropTypes) {
  return (
    <Route
      {...rest}
      render={props =>
        isAuthenticated ? <Component {...props} /> : <Redirect to="/" />
      }
    />
  );
}

function mapStateToProps(state) {
  return {
    isAuthenticated: isAuthenticatedSelector(state)
  };
}

export default connect(mapStateToProps, undefined, undefined, { pure: false })(
  User
);
