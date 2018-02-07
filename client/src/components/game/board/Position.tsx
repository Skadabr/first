import React from "react";

interface PropTypes {
  width: number;
  children: React.Component;
}

export default function Position({ children, width }: PropTypes) {
  const width_in_percents = (width | 0) + "%";

  return (
    <div
      style={{
        maxWidth: width_in_percents,
        minWidth: width_in_percents,
        minHeight: 40
      }}
    >
      {children}
    </div>
  );
}
