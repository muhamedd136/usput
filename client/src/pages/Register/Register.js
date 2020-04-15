import { Link, withRouter } from "react-router-dom";
import { Button, Spinner } from "react-bootstrap";
import React, { useState } from "react";
import auth from "../../api/auth";

const Register = props => {
  const [registerData, setRegisterData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    repeatPassword: ""
  });

  const {
    firstName,
    lastName,
    username,
    email,
    password,
    repeatPassword
  } = registerData;

  const [isFilled, setIsFilled] = useState(true);
  const [registrationFail, setRegistrationFail] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = event => {
    setRegisterData({
      ...registerData,
      [event.target.name]: event.target.value
    });
  };

  const submitForm = async () => {
    if (
      firstName.length === 0 ||
      lastName.length === 0 ||
      username.length === 0 ||
      password.length === 0 ||
      repeatPassword.length === 0
    ) {
      setIsFilled(false);
      return;
    } else {
      setIsLoading(true);
      await auth
        .register({
          firstName: firstName,
          lastName: lastName,
          username: username,
          email: email,
          password: password
        })
        .then(() => {
          setRegisterData({
            firstName: "",
            lastName: "",
            username: "",
            email: "",
            password: "",
            repeatPassword: ""
          });
          setIsLoading(false);
          props.history.push("/login");
        })
        .catch(() => {
          setIsLoading(false);
          setRegistrationFail(true);
          setRegisterData({
            firstName: "",
            lastName: "",
            username: "",
            email: "",
            password: "",
            repeatPassword: ""
          });
        });
    }
  };

  return (
    <div className="Login row">
      <div className="col-md-8 LoginLayout-left">
        <div className="Login-header">Register</div>
        <form className="Login-form">
          <div className="Input-group">
            <label className="Input-label">First name</label>
            <input
              className="Input-input"
              type="text"
              placeholder="First name"
              name="firstName"
              value={firstName}
              onChange={handleChange}
            />
          </div>
          <div className="Input-group">
            <label className="Input-label">Last name</label>
            <input
              className="Input-input"
              type="text"
              placeholder="Last name"
              name="lastName"
              value={lastName}
              onChange={handleChange}
            />
          </div>
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
            <label className="Input-label">Email</label>
            <input
              className="Input-input"
              type="email"
              placeholder="Email"
              name="email"
              value={email}
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
          <div className="Input-group">
            <label className="Input-label">Repeat password</label>
            <input
              className="Input-input"
              type="password"
              placeholder="Repeat password"
              name="repeatPassword"
              value={repeatPassword}
              onChange={handleChange}
            />
          </div>
          <div className="Buttons-group">
            <div>
              Already have an account? <Link to="/login">Login here!</Link>
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
                Register
              </Button>
            )}
          </div>
        </form>
      </div>
      <div className="col-md-4 LoginLayout-right">
        <div className="Login-banner">USPUT</div>
      </div>
    </div>
  );
};

export default withRouter(Register);
