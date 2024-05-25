import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./NavBar.css";
import { NavLink } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useGlobalContext } from "../context";
import { useNavigate } from "react-router-dom";
import { useIsAuthenticated } from "../hooks/isAuthenticated";

const NavBar = () => {
  const { userData } = useGlobalContext();
  const navigate = useNavigate();
  const isAuthenticated = useIsAuthenticated();
  const [ModeAmigo, setModeAmigo] = useState();
  const [userLoged] = useState(isAuthenticated);
  const location = useLocation();
  const inHome = location.pathname === "/";
  const modelocation = useLocation();

  useEffect(() => {
    if (modelocation.pathname === "/perfil") {
      setModeAmigo(true);
    }
  }, [modelocation]);

  const handleRefresh = () => {
    if (inHome) {
      window.location.href = "/"
    } else {
      navigate("/");
    }
  };

  return (
    <nav
      className="navbar navbar-expand-md bg-azul-fuerte text-light"
      data-bs-theme="dark"
      style={{ zIndex: "5" }}
    >
      <div className="container-fluid px-lg-5 py-0">
        <Link to={"/"} className="navbar-brand" onClick={handleRefresh}>
          Friender
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div
          className="collapse navbar-collapse d-lg-flex justify-content-between"
          id="navbarSupportedContent"
        >
          <ul className="navbar-nav px-lg-5">
            <li className="nav-item">
              <NavLink
                to={"/"}
                className={"nav-link nav-item"}
                onClick={handleRefresh}
              >
                Home
              </NavLink>
            </li>
            <li className={`nav-item ${userLoged ? "" : "hidden"}`}>
              <NavLink
                className={`nav-link nav-item  ${ModeAmigo ? "hidden" : ""}`}
                to={"/amigos?pagina=1"}
              >
                Buscar Amigos
              </NavLink>
            </li>
          </ul>
          <div className={`navbar-right-side ${userLoged ? "hidden" : ""}`}>
            <Link to={"/login"} className="btn btn-azul">
              Iniciar Sesión
            </Link>
            <Link
              to={"/registrar"}
              className="btn btn-azul navbar-register-btn"
            >
              Registrarse
            </Link>
          </div>
          <div className={`navbar-right-side ${userLoged ? "" : "hidden"}`}>
            <ul className="navbar-nav px-lg-5 ml-auto">
              <li className={`nav-item ${userLoged ? "" : "hidden"}`}>
                <NavLink
                  className={`nav-link nav-item  ${ModeAmigo ? "hidden" : ""}`}
                  to={"/cuenta-amigo"}
                >
                  Mi Perfil
                </NavLink>
              </li>
            </ul>
          </div>
        </div>

        <div className="nav-item dropdown login-buttons">
          <div className={`${userLoged ? "" : "hidden"}`}>
            <span className="profile-icon" aria-expanded="false">
              <div
                className="image-icon"
                style={{
                  backgroundImage: `url(${
                    userData.imagenBase64
                      ? `data:image/jpeg;base64,${userData.imagenBase64}`
                      : "/images/user.jpeg"
                  })`,
                }}
              ></div>
            </span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
