import React from "react";

export default function GamerStats({ health, name }) {
  return (
    <div className="card-header GamerStats" data-health={health}>
      {name}: {health}
    </div>
  );
}
