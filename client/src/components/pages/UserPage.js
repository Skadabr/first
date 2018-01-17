import React from "react";
import { connect } from "react-redux";


import Opponents from "../game/opponents/Opponents";
import GameBoard from '../game/board/GameBoard';
import Chat from '../game/chat/Chat';

class UserPage extends React.Component {
  render() {
    const { name, email } = this.props;

    return (
      <div className="row">
        <div className="col-12 col-sm-12 col-md-2">
          <Opponents />
        </div>
        <div className="col-12 col-sm-12 col-md-7">
          <GameBoard />
        </div>
        <div className="col-12 col-sm-12 col-md-3">
          <Chat />
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { name, email } = state.user;
  return { name, email };
}

export default connect(mapStateToProps)(UserPage);
