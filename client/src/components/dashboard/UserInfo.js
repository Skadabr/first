import React from "react";

export default function UserInfo({email, rate}) {
  return (
    <div>
      <div className="card-block">Email: {email}</div>
      <div className="card-block">Rate: {rate}</div>
    </div>
  );
}
