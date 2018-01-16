import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { EMPTY } from "../../state/game.state";
import Chat from "./chat/Chat";

class GameBoard extends React.Component {
  onMessage = msg => {
    this.props.sendMessage(msg, this.props.name);
  };

  render() {
    const { fight } = this.props;

    if (!fight) return;

    return (
      <div className="card">
        <div className="card-body">
          <div id="chat" className="Chat row">
            <div className="col-12 col-sm-9">
              <Chat>
              //<GameBoard>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    fight: state.game !== EMPTY
  };
}

export default connect(mapStateToProps)(GameBoard);
