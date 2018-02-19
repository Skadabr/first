import React from "react";

export default class Pocket extends React.PureComponent<any> {
  render() {
    const {health} = this.props;
    return <div>{health}</div>;
  }
}
