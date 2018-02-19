import React from "react";

interface PocketPropTypes {
  money: number;
}

export default class Pocket extends React.PureComponent<PocketPropTypes> {
  render() {
    const {money} = this.props;
    return <div>{money}</div>;
  }
}
