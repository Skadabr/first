import React, { Component } from 'react';

import User from "./components/roles/User";
import Guest from "./components/roles/Guest";
import RootPage from "./components/pages/RootPage";
import UserPage from "./components/pages/UserPage";
import Header from "./components/Header";

class App extends Component {
  render() {
    return (
      <div className="App container-fluid">
        <Header />
        <Guest path="/" exact component={RootPage} />
        <User path="/user" component={UserPage} />
      </div>
    );
  }
}

export default App;
