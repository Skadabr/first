import React from "react";
import PropTypes from "prop-types";

export default class OpponentsList extends React.Component {
  componentDidUpdate() {
    const { board } = this;
    if (board.children.length > 0) {
      board.scrollTop = board.lastChild.offsetTop;
    }
  }

  render() {
    const { opponents } = this.props;
    return (
      <div id="opponent_list" ref={el => (this.board = el)}>
        {opponents.length > 0 &&
          opponents.map(opponent => (
            <div key={opponent}>
              {opponent}
            </div>
          ))}
      </div>
    );
  }
}

OpponentsList.propTypes = {
  opponents: PropTypes.arrayOf(PropTypes.string).isRequired
};
