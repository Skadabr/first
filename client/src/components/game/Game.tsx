import React from "react";

import { GameStatus } from "../../actions/game";

import GameBoard from "./board/GameBoard";
import Chat from "./chat/Chat";

interface GamePropTypes {
  isDesktop: boolean;
  showChat: boolean;
  status: GameStatus;
}

export default class Game extends React.Component<GamePropTypes> {
  render() {
    const { isDesktop, showChat, status } = this.props;

    switch (status) {
      case GameStatus.Active:
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

      case GameStatus.Win:
        return <div className="alert alert-danger">You are a winner</div>;

      case GameStatus.Lose:
        return (
          <div className="alert alert-danger">
            You are a loser{" "}
          </div>
        );

      case GameStatus.Broken:
        return (
          <div className="alert alert-danger">
            Game process was broken
          </div>
        );

      default:
        return null;
    }
  }
}
