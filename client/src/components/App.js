import { BrowserRouter, Switch, Route } from "react-router-dom";
import Login from "./Login";
import Authenticated from "./Authenticated";
import Data from "./Data";
import React from "react";
export default class App extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route path="/login" exact component={Login} />
          <Authenticated>
            <Route path="/main" component={Data} />
          </Authenticated>
        </Switch>
      </BrowserRouter>
    );
  }
}
