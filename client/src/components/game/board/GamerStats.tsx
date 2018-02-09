import React from "react";

interface PropTypes {
  health: string;
  name: string;
}

export default function GamerStats({ health, name, money, turn }: PropTypes) {
  const userClass = turn ? "btn btn-primary" : "btn btn-danger";
  return (
    <div className="GamerStats" data-health={health}>
      <div className={userClass}>{name}</div>
      <div className="badge badge-default">health: {health}</div>
      <div className="badge badge-default">money: {money}</div>
    </div>
  );
}
