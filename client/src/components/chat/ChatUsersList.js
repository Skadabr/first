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
        {users.length > 0 &&
          users.map((user, i) => (
            <div key={i}>
              {user}
            </div>
          ))}
      </div>
    );
  }
}

ChatUsersList.propTypes = {
  users: PropTypes.arrayOf(PropTypes.string).isRequired
};
