import PropTypes from "prop-types";
import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

import { logout } from "../state/user.state";

export class Header extends React.Component {
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

Header.propTypes = {
  logout: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool.isRequired
};

function mapStateToProps(state) {
  return {
    isAuthenticated: !!state.user.token,
    name: state.user.name
  };
}

export default connect(mapStateToProps, { logout })(Header);
