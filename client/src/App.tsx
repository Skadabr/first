import * as React from "react";

import User from "./components/roles/User";
import Guest from "./components/roles/Guest";
import RootPage from "./components/pages/RootPage";
import UserPage from "./components/pages/UserPage";
import Header from "./components/Header";

class App extends React.Component {
  render() {
    return (
      <main className="App container-fluid">
        <Header />
        <div className="mt-5 pt-3">
          <Guest path="/" exact component={RootPage} />
          <User path="/user" component={UserPage} />
        </div>
      </main>
    );
  }
}

export default App;
