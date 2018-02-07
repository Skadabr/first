import React from "react";

interface PropTypes {
  health: string;
  name: string;
}

export default function GamerStats({ health, name }: PropTypes) {
  return (
    <div className="card-header GamerStats" data-health={health}>
      {name}: {health}
    </div>
  );
}
