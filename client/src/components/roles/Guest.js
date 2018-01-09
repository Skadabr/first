import React from "react";
import { Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";

function Guest({ isAuthenticated, component: Component, ...rest }) {
  return (
    <Route
      {...rest}
      render={props =>
        !isAuthenticated ? <Component {...props} /> : <Redirect to="/user" />
      }
    />
  );
}

function mapStateToProps(state) {
  return {
    isAuthenticated: !!state.user.token,
  }
}

export default connect(mapStateToProps, undefined, undefined, { pure: false })(Guest);
