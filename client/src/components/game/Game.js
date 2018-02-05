import React from "react";

import GameBoard from "./board/GameBoard";
import Chat from "./chat/Chat";

export default function Game() {
return (
  <div>
      <Chat />
      <GameBoard />
  </div>
);
}
