import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

import { selectors } from "core";

import { logout } from "../actions/auth";
import { toggleBattleChat } from "../actions/ui";

import { isDesktop } from "../selectors/ui";
const { isAuthenticated, getUserInfo, isBattleStarted } = selectors;

interface HeaderPT {
  logout: Function;
  toggleBattleChat: Function;
  isBattleStarted: boolean;
  isAuthenticated: boolean;
  isDesktop: boolean;
  name: string;
}

export class Header extends React.Component<HeaderPT> {
  exit = e => {
    e.preventDefault();
    this.props.logout(this.props.name);
  };

  toggleChat = e => {
    this.props.toggleBattleChat();
  };

  render() {
    const { isAuthenticated, isDesktop, isBattleStarted } = this.props;
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
                isBattleStarted &&
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
    isBattleStarted: isBattleStarted(state),
    isDesktop: isDesktop(state),
    isAuthenticated: isAuthenticated(state),
    name: getUserInfo(state).name
  };
}

export default connect(mapStateToProps, { logout, toggleBattleChat })(
  Header as any
);
