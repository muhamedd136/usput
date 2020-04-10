import { Route, Redirect } from "react-router-dom";
import React from "react";

const PublicRoute = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) =>
        !localStorage.getItem("access_token") ? (
          <Component {...props} />
        ) : (
          <Redirect to="/profile" />
        )
      }
    />
  );
};

export default PublicRoute;
