import { Button, Spinner } from "react-bootstrap";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import auth from "../../api/auth";
import "./Login.scss";

const Login = (props) => {
  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });

  const { username, password } = loginData;

  const [isLoading, setIsLoading] = useState(false);
  const [isFilled, setIsFilled] = useState(true);
  const [isIncorrect, setIsIncorrect] = useState(false);

  const handleChange = (event) => {
    setLoginData({
      ...loginData,
      [event.target.name]: event.target.value,
    });
  };

  const submitForm = async () => {
    if (username.length === 0 || password.length === 0) {
      setIsFilled(false);
      return;
    }
    setIsLoading(true);
    setIsIncorrect(false);

    await auth
      .login(loginData)
      .then((response) => {
        localStorage.setItem("access_token", response.data.jwt);
        localStorage.setItem("user_cache", JSON.stringify(response.data.user));
        setIsLoading(false);
        setLoginData({
          username: "",
          password: "",
        });
        props.history.push("/profile");
      })
      .catch(() => {
        setIsLoading(false);
        setLoginData({
          username: "",
          password: "",
        });
        setIsIncorrect(true);
      });
    setIsLoading(false);
  };

  return (
    <div className="Login row">
      <div className="col-md-8 LoginLayout-left">
        <div className="Login-header">Login</div>
        <form className="Login-form">
          <div className="Input-group">
            <label className="Input-label">Username</label>
            <input
              className="Input-input"
              type="username"
              placeholder="Username"
              name="username"
              value={username}
              onChange={handleChange}
            />
          </div>
          <div className="Input-group">
            <label className="Input-label">Password</label>
            <input
              className="Input-input"
              type="password"
              placeholder="Password"
              name="password"
              value={password}
              onChange={handleChange}
            />
          </div>
          <div className="Buttons-group">
            <div>
              Don't have an account? <Link to="/register">Register here!</Link>
            </div>
            {isLoading ? (
              <Spinner size="sm" variant="info" animation="grow" />
            ) : (
              <Button
                block={true}
                size="sm"
                variant="info"
                onClick={submitForm}
              >
                Login
              </Button>
            )}
            {isFilled ? null : (
              <div className="Login-fail">Please fill out all fields.</div>
            )}
            {isIncorrect ? (
              <div className="Login-fail">
                Incorrect data, please try again.
              </div>
            ) : null}
          </div>
        </form>
      </div>
      <div className="col-md-4 LoginLayout-right">
        <div className="Login-banner">USPUT</div>
      </div>
    </div>
  );
};

export default Login;
