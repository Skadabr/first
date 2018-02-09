import React from "react";

interface PropTypes {
  width: number;
  children: React.Component;
}

export default function Position({ children, width }: PropTypes) {

  const width_in_percents = (width + "").substr(0, 3) + "%";

  return (
    <div
      style={{
        maxWidth: width_in_percents,
        border: "1px solid black",
        minWidth: width_in_percents,
        minHeight: 100,
      }}
    >
      {children}
    </div>
  );
}
