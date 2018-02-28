import React from "react";
import { Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";

import { isAuthenticated } from "../../selectors/user";

interface PropTypes {
  isAuthenticated: boolean;
  component: any;
  path: string;
  exact?: boolean;
}

function UserRoute({
  isAuthenticated,
  component: Component,
  ...rest
}: PropTypes) {
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
    isAuthenticated: isAuthenticated(state)
  };
}

export default connect(mapStateToProps, undefined, undefined, { pure: false })(
  UserRoute
);
