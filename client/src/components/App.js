import { BrowserRouter, Switch, Route } from "react-router-dom";
import Home from "./Home";
import Login from "./Login";
import Authenticated from "./Authenticated";
import Protected from "./Data";
import React from "react";
export default class App extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/login" component={Login} />
          <Authenticated>
            <Route path="/me" component={Protected} />
          </Authenticated>
        </Switch>
      </BrowserRouter>
    );
  }
}
