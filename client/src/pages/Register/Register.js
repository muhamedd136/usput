import { Button, Spinner, Form, InputGroup } from "react-bootstrap";
import { Link, withRouter } from "react-router-dom";
import React, { useState } from "react";
import auth from "../../api/auth";
import "./Register.scss";

const Register = (props) => {
  const [registerData, setRegisterData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    repeatPassword: "",
  });

  const {
    firstName,
    lastName,
    username,
    email,
    password,
    repeatPassword,
  } = registerData;

  const [registrationFail, setRegistrationFail] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [validated, setValidated] = useState(false);
  const [isFilled, setIsFilled] = useState(true);

  const handleChange = (event) => {
    setRegisterData({
      ...registerData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    const form = event.currentTarget;
    console.log(form.checkValidity());

    if (
      form.checkValidity() === false &&
      (firstName.length === 0 ||
        lastName.length === 0 ||
        username.length === 0 ||
        email.length === 0 ||
        password.length === 0 ||
        repeatPassword.length === 0)
    ) {
      event.preventDefault();
      event.stopPropagation();
    }
    setValidated(true);
    setIsLoading(true);
    await auth
      .register(registerData)
      .then(() => {
        setRegisterData({
          firstName: "",
          lastName: "",
          username: "",
          email: "",
          password: "",
          repeatPassword: "",
        });
        setIsLoading(false);
        props.history.push("/login");
      })
      .catch(() => {
        setIsLoading(false);
        setRegistrationFail(true);
      });
  };

  return (
    <div className="Login row">
      <div className="col-md-8 LoginLayout-left">
        <div className="Login-header">Register</div>
        <Form
          className="Register-Form"
          noValidate
          validated={validated}
          onSubmit={handleSubmit}
        >
          <Form.Group controlId="firstName">
            <Form.Label>First name</Form.Label>
            <Form.Control
              required
              type="text"
              name="firstName"
              value={firstName}
              onChange={handleChange}
              placeholder="First name"
            />
            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
            <Form.Control.Feedback type="invalid">
              Please provide a valid name.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="lastName">
            <Form.Label>Last name</Form.Label>
            <Form.Control
              required
              type="text"
              placeholder="Last name"
              name="lastName"
              value={lastName}
              onChange={handleChange}
            />
            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
            <Form.Control.Feedback type="invalid">
              Please provide a valid last name.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="username">
            <Form.Label>Username</Form.Label>
            <InputGroup>
              <InputGroup.Prepend>
                <InputGroup.Text id="inputGroupPrepend">@</InputGroup.Text>
              </InputGroup.Prepend>
              <Form.Control
                type="text"
                placeholder="Username"
                aria-describedby="inputGroupPrepend"
                required
                name="username"
                value={username}
                onChange={handleChange}
              />
              <Form.Control.Feedback type="invalid">
                Please choose a username.
              </Form.Control.Feedback>
            </InputGroup>
          </Form.Group>
          <Form.Group controlId="email">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Email"
              required
              name="email"
              value={email}
              onChange={handleChange}
            />
            <Form.Control.Feedback type="invalid">
              Please provide a valid email.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              required
              name="password"
              value={password}
              onChange={handleChange}
            />
            <Form.Control.Feedback type="invalid">
              Please provide a password.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="repeatPassword">
            <Form.Label>Repeat password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Repeat password"
              required
              name="repeatPassword"
              value={repeatPassword}
              onChange={handleChange}
            />
            <Form.Control.Feedback type="invalid">
              Passwords don't match.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group>
            <Form.Label>
              Already have an account? <Link to="/login">Login here!</Link>
            </Form.Label>
          </Form.Group>
          <Form.Group>
            {isLoading ? (
              <Spinner size="sm" variant="info" animation="grow" />
            ) : (
              <Button block={true} size="md" variant="info" type="submit">
                Register
              </Button>
            )}
          </Form.Group>
        </Form>
      </div>
      <div className="col-md-4 LoginLayout-right">
        <div className="Login-banner">USPUT</div>
      </div>
    </div>
  );
};

export default withRouter(Register);
