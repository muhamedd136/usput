import { BrowserRouter as Router, Switch } from "react-router-dom";
import PrivateRoute from "./shared/routes/PrivateRoute";
import PublicRoute from "./shared/routes/PublicRoute";
import Register from "./pages/Register/Register";
import Routes from "./shared/routes/Routes";
import Login from "./pages/Login/Login";
import React from "react";
import "./App.scss";

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <PublicRoute path="/register" component={Register} />
          <PublicRoute path="/login" component={Login} />
          <PrivateRoute path="" component={Routes} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
