import React from "react";

import GameBoard from "./board/GameBoard";
import Chat from "./chat/Chat";

interface GamePropTypes {
  isDesktop: boolean;
  showChat: boolean;
}

export default class Game extends React.Component<GamePropTypes> {
  render() {
    const { isDesktop, showChat } = this.props;

    return isDesktop ? (
      <div className="row">
        <div className="col-lg-9">
          <GameBoard />
        </div>
        <div className="col-lg-3">
          <Chat />
        </div>
      </div>
    ) : (
      <div className="row">
        {showChat ? (
          <div className="col-12">
            <Chat />
          </div>
        ) : (
          <div className="col-12">
            <GameBoard />
          </div>
        )}
      </div>
    );
  }
}
