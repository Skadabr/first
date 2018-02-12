import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

import { logout } from "../actions/auth";
import { gameToggleChat } from "../actions/game";
import { isAuthenticatedSelector, userInfoSelector } from "../selectors/user";
import { fightIsStartedSelector } from "../selectors/game";
import { isDesktopSelector } from "../selectors/stats";

interface HeaderPropTypes {
  logout: Function;
  gameToggleChat: Function;
  fight: boolean;
  isAuthenticated: boolean;
  isDesktop: boolean;
  name: string;
}

export class Header extends React.Component<HeaderPropTypes> {
  exit = e => {
    e.preventDefault();
    this.props.logout(this.props.name);
  };

  toggleChat = e => {
    this.props.gameToggleChat();
  };

  render() {
    const { isAuthenticated, isDesktop, fight } = this.props;
    const homeLink = isAuthenticated ? "/user" : "/";

    return (
      <nav
        id="app_header"
        className="navbar navbar-expand navbar-dark bg-dark fixed-top"
      >
        <div className="container">
          <div className="navbar-collapse">
            <ul className="nav navbar-nav mr-auto">
              <li className="nav-item">
                <Link to={homeLink} className="nav-link">
                  Home
                </Link>
              </li>
              {isAuthenticated && (
                <li className="nav-item">
                  <a
                    id="logout"
                    className="nav-link"
                    href="#"
                    onClick={this.exit}
                  >
                    Exit
                  </a>
                </li>
              )}
            </ul>
            <ul className="nav navbar-nav mr-auto">
              {isAuthenticated &&
                fight &&
                !isDesktop && (
                  <li className="nav-item">
                    <a
                      id="toggle-chat"
                      className="nav-link"
                      href="#"
                      onClick={this.toggleChat}
                    >
                      Toggle Chat
                    </a>
                  </li>
                )}
            </ul>
          </div>
        </div>
      </nav>
    );
  }
}

function mapStateToProps(state) {
  return {
    fight: fightIsStartedSelector(state),
    isDesktop: isDesktopSelector(state),
    isAuthenticated: isAuthenticatedSelector(state),
    name: userInfoSelector(state).name
  };
}

export default connect(mapStateToProps, { logout, gameToggleChat })(
  Header as any
);
