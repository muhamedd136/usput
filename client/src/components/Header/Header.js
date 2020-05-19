import { Navbar, Nav, NavDropdown, Modal, Button } from "react-bootstrap";
import logo from "../../assets/youtube_profile_image.png";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Header.scss";

const Header = (props) => {
  const [modalShow, setModalShow] = useState(false);

  return (
    <div className="header">
      <Modal show={modalShow} className="signout_modal">
        <Modal.Header>Logout</Modal.Header>
        <Modal.Body>Are you sure you want to sign out from Usput?</Modal.Body>
        <Modal.Footer>
          <div className="modal-buttons">
            <Button
              variant="outline-danger"
              onClick={() => {
                setModalShow(false);
              }}
            >
              NO
            </Button>
            <Button
              variant="info"
              onClick={() => {
                localStorage.removeItem("access_token");
                localStorage.removeItem("user_cache");
                props.history.push("/login");
              }}
            >
              YES
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
      <Navbar bg="light" collapseOnSelect expand="md">
        <Navbar.Toggle />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="navBase">
            <div className="navBase-logo">
              <a
                target="_blank"
                href="https://www.github.com/muhamedd136/usput"
                rel="noopener noreferrer"
              >
                <img src={logo} alt="" />
              </a>
            </div>
            <Nav.Link eventKey="1" as={Link} to="/profile">
              Profile
            </Nav.Link>
            <Nav.Link eventKey="2" as={Link} to="/offers">
              Offers
            </Nav.Link>
            <Nav.Link eventKey="3" as={Link} to="/orders">
              Orders
            </Nav.Link>

            <NavDropdown.Divider />
            <Nav.Link
              eventKey="100"
              className="sign_out-mobile"
              onClick={() => {
                setModalShow(true);
              }}
            >
              Logout
            </Nav.Link>

            <NavDropdown.Divider />
          </Nav>
        </Navbar.Collapse>
        <Nav.Link
          className="sign_out-desktop"
          eventKey="101"
          onClick={() => {
            setModalShow(true);
          }}
        >
          Logout
        </Nav.Link>
      </Navbar>
    </div>
  );
};

export default Header;
