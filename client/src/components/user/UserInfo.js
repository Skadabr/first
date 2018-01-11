import React from "react";

export default function UserInfo({name, email}) {
  return (
    <div>
      <div>Name: {name}</div>
      <div>Email: {email}</div>
    </div>
  );
}
