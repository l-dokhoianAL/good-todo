import { useCallback, useEffect, useState } from "react";
import { Navbar, Container, Nav, NavDropdown } from "react-bootstrap";
import { NavLink, Link } from "react-router-dom";
import { logOut } from "../../helpers/auth";
import { useActions, useAppSelector } from "../../helpers/hooks";
import Settings from "../Settings";
import styles from "./header.module.css";

function Header() {
  const { getUser, clearFilters } = useActions();
  const { isAuthenticated, user } = useAppSelector((state) => state);

  useEffect(() => {
    isAuthenticated && getUser();
  }, [isAuthenticated, getUser]);

  const [settingsModal, setSettingsModal] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const hideModal = useCallback(() => {
    setSettingsModal(false);
  }, []);

  return (
    <>
      <Navbar
        className={styles.navbar}
        collapseOnSelect
        expand="lg"
        bg="dark"
        variant="dark"
        expanded={expanded}
      >
        <Container>
          <Navbar.Brand>
            <NavLink
              className={styles.selected}
              to="/home"
              onClick={() => clearFilters()}
            >
              ToDo List
            </NavLink>
          </Navbar.Brand>
          <Navbar.Toggle
            onClick={() => setExpanded((prev) => !prev)}
            aria-controls="responsive-navbar-nav"
          />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto ms-3 d-flex align-items-lg-center">
              {isAuthenticated && (
                <NavLink
                  className={({ isActive }) =>
                    `me-3 ${styles.navlink} ` +
                    (isActive ? styles.selected : "")
                  }
                  to="/home"
                  onClick={() => {
                    setExpanded(false);
                    clearFilters();
                  }}
                >
                  Home
                </NavLink>
              )}
              {!isAuthenticated && (
                <>
                  <NavLink
                    className={({ isActive }) =>
                      `me-3 ${styles.navlink} ` +
                      (isActive ? styles.selected : "")
                    }
                    to="/sign-in"
                    onClick={() => setExpanded(false)}
                  >
                    Login
                  </NavLink>
                  <NavLink
                    className={({ isActive }) =>
                      `me-3 ${styles.navlink} ` +
                      (isActive ? styles.selected : "")
                    }
                    onClick={() => setExpanded(false)}
                    to="/sign-up"
                  >
                    Register
                  </NavLink>
                </>
              )}
              <NavLink
                onClick={() => setExpanded(false)}
                className={({ isActive }) =>
                  `me-3 ${styles.navlink} ` + (isActive ? styles.selected : "")
                }
                to="/about"
              >
                About
              </NavLink>
              <NavLink
                onClick={() => setExpanded(false)}
                className={({ isActive }) =>
                  `me-3 ${styles.navlink} ` + (isActive ? styles.selected : "")
                }
                to="/contact"
              >
                Contact
              </NavLink>
            </Nav>
            <Nav className="d-flex align-items-lg-center">
              {user && (
                <NavDropdown
                  id="nav-dropdown-dark-example"
                  title={`${user.name} ${user.surname}`}
                  menuVariant="dark"
                >
                  <NavDropdown.Item
                    onClick={() => {
                      setExpanded(false);
                      setSettingsModal(!settingsModal);
                    }}
                  >
                    User settings
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <div className="d-flex">
                    <Link
                      onClick={() => {
                        setExpanded(false);
                        logOut();
                      }}
                      to="/sign-in"
                      className={styles.sign_out}
                    >
                      Log out{" "}
                    </Link>
                  </div>
                </NavDropdown>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      {settingsModal && <Settings hideModal={hideModal} />}
    </>
  );
}

export default Header;
