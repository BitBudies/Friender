import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";
import { FaEyeSlash, FaEye } from "react-icons/fa";
import { useLoginMutation } from "./authSlice";
import { useGlobalContext } from "../../context";
import logo from "../../logo-friender.png";
import { useCookies } from "react-cookie";
import { useRedirectIfAuthenticated } from "../../hooks/isAuthenticated.js";

const LogIn = () => {
  const redirectIfAuth = useRedirectIfAuthenticated();
  redirectIfAuth();
  const [cookies, setCookie] = useCookies(["token"]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [disableBtnLoading, setDisableBtnLoading] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);
  const [supportingText, setSupportingText] = useState("");

  const navigate = useNavigate();

  const { setClientId } = useGlobalContext();

  const [
    login,
    { data: response, isLoading, isSuccess, isError, error: responseError },
  ] = useLoginMutation();

  const handleBtn = async (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append("username_or_email", username);
    form.append("password", password);
    await login(form);
  };

  useEffect(() => {
    console.log(response, "response");

    if (isLoading) {
      setDisableBtnLoading(true);
      setSupportingText("");
    }
    if (isSuccess) {
      setClientId(response.id);
      window.localStorage.setItem("clientId", response.id);
      setCookie("token", response.token);
      navigate("/amigos?pagina=1");
    }
    if (isError) {
      console.log(responseError, "error");
      setDisableBtnLoading(false);
      if (responseError.data.tiempo) {
        setSupportingText("");
        const tiempoRestante = responseError.data.tiempo;
        if (tiempoRestante) {
          setRemainingTime(tiempoRestante);
          console.log(tiempoRestante);
          const timer = setInterval(() => {
            setRemainingTime((prevTime) => prevTime - 1);
          }, 1000);
          // cuando llegue a 0 lo eliminamos
          setTimeout(() => {
            clearInterval(timer);
          }, tiempoRestante * 1000);
        } else {
          console.log("Error:", responseError.data.error); // Log en caso de error
        }
      } else {
        setSupportingText(responseError.data.error);
      }
    }
  }, [
    isError,
    isLoading,
    isSuccess,
    navigate,
    response,
    responseError,
    setClientId,
    setCookie,
  ]);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="form-section mw-100 min-vh-100 d-flex flex-column justify-content-rigth align-items-center">
      <div className="login-logo-box">
        <img src={logo} alt="icono-friender"></img>
        <h1>Friender</h1>
      </div>

      <div className="form-section-rigth login-box">
        <p className="mb-4 fw-bold login-box-title">
          Inicia sesión en Friender
        </p>
        <form className="login-form">
          <div className="mb-2">
            <input
              type="text"
              className="form-control"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value.trim())}
              placeholder="Usuario o Correo electrónico"
              maxLength={255}
            />
          </div>

          <div className="mb-2 password-input">
            <input
              type={showPassword ? "text" : "password"}
              className="form-control"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Contraseña"
              maxLength={65}
            />
            <span className="login-password-icon" onClick={toggleShowPassword}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          {supportingText && (
            <p className="text-danger mb-2 login-box-text-danger">
              {supportingText}
            </p>
          )}
          {remainingTime > 0 && (
            <p className="text-danger mb-2 login-box-text-danger">
              Inténtalo de nuevo en {remainingTime} segundos.
            </p>
          )}

          <button
            className={`btn btn-azul mb-2 button-login ${
              disableBtnLoading && "disabled"
            } `}
            disabled={remainingTime > 0}
            onClick={handleBtn}
          >
            Iniciar Sesión
          </button>

          <p className="form-text">
            <Link to={"/resetPassword"}>¿Has olvidado la contraseña?</Link>
          </p>

          <div className="login-box-separator">
            <hr></hr>
            <p>O</p>
            <hr></hr>
          </div>
          <p className="form-text form-register-text">
            ¿No tienes una cuenta?<Link to={"/registrar"}> Regístrate</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LogIn;
