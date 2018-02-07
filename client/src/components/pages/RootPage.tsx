import * as React from "react"

import Auth from "../auth/Auth";

export default class RootPage extends React.Component {
  render() {
    return (
      <div className="row">
        <div className="col-12 col-sm-6 offset-sm-3">
          <Auth />
        </div>
      </div>
    );
  }
}
