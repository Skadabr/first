import React from "react";
import { Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";

import { isBattleStarted } from "../../selectors/battle";
import { isAuthenticated } from "../../selectors/user";

// interface BattleRoutePropTypes {
//   isBattleStarted: boolean;
//   isAuthenticated: boolean;
//   component: any;
//   path: string;
//   exact?: boolean;
// }

class BattleRoute extends React.Component<any> {
  render() {
    const {
      isBattleStarted,
      isAuthenticated,
      component: Component,
      ...rest
    } = this.props;

    return (
      <Route
        {...rest}
        render={props =>
          isAuthenticated && isBattleStarted ? (
            <Component {...props} />
          ) : (
            <Redirect to="/user" />
          )
        }
      />
    );
  }
}

function mapStateToProps(state) {
  return {
    isBattleStarted: isBattleStarted(state),
    isAuthenticated: isAuthenticated(state)
  };
}

export default connect(mapStateToProps, undefined, undefined, { pure: false })(
  BattleRoute as any
);
