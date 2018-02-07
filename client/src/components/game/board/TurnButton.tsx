import * as React from "react";

interface PropTypes {
  turn: boolean;
  onTurn: Function;
}

export default function TurnButton({ turn, onTurn }: PropTypes) {
  return (
    <div className="card-block">
      <button
        id="turn"
        className="btn btn-primary"
        disabled={!turn}
        onClick={onTurn}
      >
        Turn
      </button>
    </div>
  );
}
