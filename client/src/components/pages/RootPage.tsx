import React from "react"

import Auth from "../auth/Auth";

export default class RootPage extends React.PureComponent {
  render() {
    return (
      <div className="row">
        <div className="col-12 col-sm-6 offset-sm-3 col-md-4 offset-md-4 col-lg-4 offset-lg-4">
          <Auth />
        </div>
      </div>
    );
  }
}
