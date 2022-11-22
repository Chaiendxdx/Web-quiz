import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { NavLink, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useState } from "react";

const Header = () => {
  let account = useSelector((state) => state.user.account);
  let isAuthenticated = useSelector((state) => state.user.isAuthenticated);

  if (localStorage.getItem("id")) {
    isAuthenticated = true;
    account = localStorage.getItem("account");
  }

  const navigate = useNavigate();
  const handleLogin = () => {
    navigate("/login");
  };

  const handleSignup = () => {
    navigate("/signup");
  };

  const handleLogout = () => {
    localStorage.removeItem("id");
    localStorage.removeItem("account");

    navigate("/");
  };

  useEffect(() => {
    let timeId = setTimeout(() => {
      localStorage.removeItem("id");
      localStorage.removeItem("account");
    }, 1800000);

    return () => {
      clearTimeout(timeId);
    };
  }, []);
  return (
    <Navbar bg="light" expand="lg">
      <Container>
        <NavLink to="/" className="navbar-brand">
          Web Quiz
        </NavLink>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <NavLink to="/" className="nav-link">
              Home
            </NavLink>

            <NavLink to="/users" className="nav-link">
              Users
            </NavLink>

            <NavLink to="/admins" className="nav-link">
              Admin
            </NavLink>

            {/* <Nav.Link href="/">Home</Nav.Link>
            <Nav.Link href="/users">Users</Nav.Link>
            <Nav.Link href="/admins">Admin</Nav.Link> */}
          </Nav>

          <Nav>
            {isAuthenticated === true && localStorage.getItem("id") ? (
              <NavDropdown title="Settings" id="basic-nav-dropdown">
                <NavDropdown.Item onClick={() => handleLogout()}>
                  Log out
                </NavDropdown.Item>

                <NavDropdown.Divider />
                <NavDropdown.Item>Profile</NavDropdown.Item>
              </NavDropdown>
            ) : (
              <>
                <button className="btn btn-login" onClick={() => handleLogin()}>
                  Log in
                </button>
                <button
                  className="btn btn-signup"
                  onClick={() => handleSignup()}
                >
                  Sign up
                </button>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
