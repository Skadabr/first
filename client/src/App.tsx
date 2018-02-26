import * as React from "react";

import IO from "./socket";

import UserRoute from "./components/roles/UserRoute";
import GuestRoute from "./components/roles/GuestRoute";
import RootPage from "./components/pages/RootPage";
import UserPage from "./components/pages/UserPage";
import Header from "./components/Header";
import PropTypes from "prop-types";

class App extends React.Component {
  static contextTypes = {
    router: PropTypes.object,
  }

  componentDidMount() {
    IO(undefined, undefined, this.context.router);
  }

  render() {
    return (
      <main className="App container-fluid">
        <Header />
        <div className="mt-5 pt-3">
          <GuestRoute path="/" exact component={RootPage} />
          <UserRoute path="/user" component={UserPage} />
        </div>
      </main>
    );
  }
}

export default App;
