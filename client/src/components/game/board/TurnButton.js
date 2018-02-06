import React from "react";
import PropTypes from "prop-types";

export default class TurnButton extends React.Component {
  render() {
    return (
      <div className="card-block">
        <button id="turn" className="btn btn-primary" disabled={!this.props.turn} onClick={this.props.onTurn}>
          Turn
        </button>
      </div>
    );
  }
}
