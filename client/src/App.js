import { BrowserRouter as Router, Switch } from "react-router-dom";
import PrivateRoute from "./shared/routes/PrivateRoute";
import PublicRoute from "./shared/routes/PublicRoute";
import Routes from "./shared/routes/Routes";
import React from "react";
import "./App.scss";

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <PrivateRoute path="" component={Routes} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
