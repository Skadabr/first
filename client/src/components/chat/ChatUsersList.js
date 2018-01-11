import React from "react";
import PropTypes from "prop-types";

export default class ChatUsersList extends React.Component {
  componentDidUpdate() {
    const { board } = this;
    if (board.children.length > 0) {
      board.scrollTop = board.lastChild.offsetTop;
    }
  }

  render() {
    const { users } = this.props;
    return (
      <div id="user_list" ref={el => (this.board = el)}>
        <div className="ChatUsersHeader">
          Users
        </div>
        {users.length > 0 &&
          users.map(user => (
            <div>
              <span className="ChatUserName" key={user}>
                {user}
              </span>
            </div>
          ))}
      </div>
    );
  }
}

ChatUsersList.propTypes = {
  users: PropTypes.arrayOf(PropTypes.string).isRequired
};
