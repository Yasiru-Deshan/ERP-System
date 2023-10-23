import React, { useState, useEffect, useContext } from "react";
import { FaBars } from "react-icons/fa";
import { IconContext } from "react-icons/lib";
import { useNavigate } from "react-router-dom";
import {
  Nav,
  NavbarContainer,
  MobileIcon,
  NavMenu,
  NavBtnLink,
  NavLinks,
} from "./NavbarElements";
import { AuthContext } from "../../context/AuthContext";

const Navbar = ({ toggle }) => {
  const [scrollNav, setScrollNav] = useState(false);
  const navigate = useNavigate();

  const changeNav = () => {
    if (window.scrollY >= 80) {
      setScrollNav(true);
    } else {
      setScrollNav(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", changeNav);
  }, []);

  const auth = useContext(AuthContext);

  const signOut = () => {
    auth.logout();
    navigate("/home");
    window.location.reload();
  };


  return (
    <>
      <IconContext.Provider value={{ color: "#fff" }}>
        <Nav scrollNav={scrollNav}>
          <NavbarContainer>
            {/* <NavLogo to="/" onClick={toggleHome}>
              ERP SYSTEM
            </NavLogo> */}

            <MobileIcon onClick={toggle}>
              <FaBars />
            </MobileIcon>
            <NavLinks
              to="/home"
              smooth={true}
              duration={500}
              spy={true}
              exact="true"
              offset={-80}
            >
              Home
            </NavLinks>
            {auth.role !== "csr" && auth.role !== "sm" && (
              <NavLinks
                to="/cart"
                smooth={true}
                duration={500}
                spy={true}
                exact="true"
                offset={-80}
              >
                Cart
              </NavLinks>
            )}
            {auth.isLoggedIn && auth.role === "user" && (
              <NavLinks
                to="/profile"
                smooth={true}
                duration={500}
                spy={true}
                exact="true"
                offset={-80}
              >
                Profile
              </NavLinks>
            )}
            {auth.role === "user" && (
              <div>
                <NavLinks
                  to="/orders"
                  smooth={true}
                  duration={500}
                  spy={true}
                  exact="true"
                  offset={-80}
                >
                  Orders
                </NavLinks>
              </div>
            )}
            <NavMenu>
              {auth.isLoggedIn && auth.token != null && (
                <div style={{ color: "white", marginTop: "10px" }}>
                  {auth.fullName}[{auth.role}]
                </div>
              )}
              {auth.isLoggedIn && (
                <NavBtnLink
                  className="btn btn-outline-danger m-2"
                  onClick={signOut}
                >
                  Logout
                </NavBtnLink>
              )}
              {!auth.isLoggedIn && (
                <NavBtnLink className="btn btn-outline-danger m-2" to="/login">
                  Sign In
                </NavBtnLink>
              )}
            </NavMenu>
          </NavbarContainer>
        </Nav>
      </IconContext.Provider>
    </>
  );
};

export default Navbar;
