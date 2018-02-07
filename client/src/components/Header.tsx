import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

import { logout } from "../actions/auth";
import { isAuthenticatedSelector, userInfoSelector } from "../selectors/user";

interface PropTypes {
  logout: Function;
  isAuthenticated: boolean;
  name: string;
}

export class Header extends React.Component<PropTypes> {
  exit = e => {
    e.preventDefault();
    this.props.logout(this.props.name);
  };

  render() {
    const { isAuthenticated } = this.props;
    const homeLink = isAuthenticated ? "/user" : "/";

    return (
      <div id="app_header">
        <ul className="nav">
          <li className="nav-item">
            <Link to={homeLink} className="nav-link">
              Home
            </Link>
          </li>
          {isAuthenticated && (
            <li className="nav-item">
              <a id="logout" className="nav-link" onClick={this.exit}>
                Exit
              </a>
            </li>
          )}
        </ul>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    isAuthenticated: isAuthenticatedSelector(state),
    name: userInfoSelector(state).name
  };
}

export default connect(mapStateToProps, { logout })(Header as any);
