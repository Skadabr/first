import React from "react";
import { Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";

import { isBattleStartedSelector } from "../../selectors/battle";
import { isAuthenticatedSelector } from "../../selectors/user";

interface PropTypes {
  isBattleStarted: boolean;
  isAuthenticated: boolean;
  component: any;
  path: string;
  exact?: boolean;
}

function BattleRoute({
  isBattleStarted,
  isAuthenticated,
  component: Component,
  ...rest
}: PropTypes) {
  return (
    <Route
      {...rest}
      render={props =>
        isAuthenticatedSelector && isBattleStarted ? (
          <Component {...props} />
        ) : (
          <Redirect to="/user" />
        )
      }
    />
  );
}

function mapStateToProps(state) {
  return {
    isBattleStarted: isBattleStartedSelector(state),
    isAuthenticated: isAuthenticatedSelector(state)
  };
}

export default connect(mapStateToProps, undefined, undefined, { pure: false })(
  BattleRoute
);
