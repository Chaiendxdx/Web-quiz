import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { useState } from "react";
import { toast } from "react-toastify";
import { doLogout } from "../../redux/action/userAction";
import Language from "./Language";
import { SiReactivex } from "react-icons/si";
import { useTranslation, Trans } from "react-i18next";
import Profile from "./Profile";
const Header = () => {
  let account = useSelector((state) => state.user.account);
  let isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [showModal, setShowModal] = useState(false);
  if (localStorage.getItem("id")) {
    isAuthenticated = true;
    // account = localStorage.getItem("account");
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
    localStorage.removeItem("persist:root");
    dispatch(doLogout());
    toast.success("Log out success!");
    navigate("/");
  };

  const handleClose = () => {
    setShowModal(false);
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
  console.log("account: ", account);
  return (
    <>
      <Navbar bg="light" expand="lg">
        <Container>
          <NavLink to="/" className="navbar-brand">
            <SiReactivex className="brand-icon" />
            Web Quiz
          </NavLink>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <NavLink to="/" className="nav-link">
                {t("header.home")}
              </NavLink>

              <NavLink to="/users" className="nav-link">
                {t("header.user")}
              </NavLink>
              {(account && account.role && account.role === "ADMIN") ||
              !isAuthenticated ? (
                <NavLink to="/admins" className="nav-link">
                  {t("header.admin")}
                </NavLink>
              ) : (
                <></>
              )}

              {/* <Nav.Link href="/">Home</Nav.Link>
            <Nav.Link href="/users">Users</Nav.Link>
            <Nav.Link href="/admins">Admin</Nav.Link> */}
            </Nav>

            <Nav>
              {isAuthenticated === true && localStorage.getItem("id") ? (
                <NavDropdown
                  title={t("header.settings")}
                  id="basic-nav-dropdown"
                >
                  <NavDropdown.Item>
                    <span onClick={() => setShowModal(true)}>
                      {t("header.profile")}
                    </span>
                  </NavDropdown.Item>
                  <NavDropdown.Divider />

                  <NavDropdown.Item onClick={() => handleLogout()}>
                    {t("header.logout")}
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                <>
                  <button
                    className="btn btn-login"
                    onClick={() => handleLogin()}
                  >
                    {t("header.login")}
                  </button>
                  <button
                    className="btn btn-signup"
                    onClick={() => handleSignup()}
                  >
                    {t("header.signup")}
                  </button>
                </>
              )}
              <Language />
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Profile show={showModal} handleClose={handleClose} />
    </>
  );
};

export default Header;
