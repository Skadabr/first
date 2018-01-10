import React from "react";
import PropTypes from "prop-types";

export default class MessageBoard extends React.Component {
  render() {
    const { msgs } = this.props;
    return (
      <div id="board">
        {msgs.length > 0 &&
          msgs.map((msg, i) => (
            <div key={i}>
              <div>{msg.user}</div>
              <div>{msg.msg}</div>
            </div>
          ))}
      </div>
    );
  }
}

MessageBoard.propTypes = {
  msgs: PropTypes.arrayOf(PropTypes.string).isRequired
};
