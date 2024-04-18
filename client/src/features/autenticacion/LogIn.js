import React,{useEffect, useState} from 'react'
import { Link, useNavigate } from 'react-router-dom';
import "./Login.css";
import { FaEyeSlash, FaEye } from "react-icons/fa";
import { useLoginMutation } from './authSlice';
import { useGlobalContext } from '../../context';

const LogIn = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showFeedback, setShowFeedback] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [disableBtn,setDisableBtn] = useState(false);
  const navigate = useNavigate();

  const {setClientId} = useGlobalContext();

  const [login, {data: response,isLoading,isSuccess,isError}] = useLoginMutation();

  const handleBtn = async(e) => {
    e.preventDefault();
    if(username  && password){
      const data = {usuario : username,contrasena : password};
      await login(data);
    }

  };
  
  const checkLoginResponse = () => {
    if(isLoading){
      setDisableBtn(true);
    }
    if(isSuccess){
      setDisableBtn(true);
      if(response.id !== 0){
        setClientId(1);
        navigate("/amigos/page/1");
      }
    }
  }
  
  useEffect(checkLoginResponse,[isError, isLoading, isSuccess, response])

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="form-section mw-100 min-vh-100 d-flex flex-column justify-content-center align-items-center">
      <div className='login-logo-box'>
        <img src="https://cdn-icons-png.flaticon.com/512/7081/7081305.png" alt="icono-friender"></img>
        <h1>Friender</h1>
      </div>

      <div className="form-section-center login-box">
        <p className="mb-4 fw-bold login-box-title">Inicia sesión en Friender</p>
        <form className='login-form'>
          <div className="mb-2">
            <input
              type="text"
              className="form-control"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value.trim())}
              placeholder='Correo electrónico'
            />
          </div>

          <div className="mb-2 password-input">
            <input
              type={showPassword ? "text" : "password"}
              className="form-control"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder='Contraseña'
            />
            <span className="password-icon" onClick={toggleShowPassword}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          {showFeedback && (
            <p className="text-danger mb-2" style={{ fontSize: "0.9rem",textAlign: "left",paddingLeft: "20px" }}>
              Contraseña incorrecta
            </p>
          )}
          
          <button className={`btn btn-azul mb-2 button-login ${disableBtn && "disabled"}`} onClick={handleBtn}>
            Iniciar Sesión
          </button>
          <p className='form-text'>
            <Link to={"/register"}>¿Haz olvidado la contraseña?</Link>
          </p>
          <div className='login-box-separator'>
            <hr></hr>
            <p>O</p>
            <hr></hr>
          </div>
          <p className="form-text form-register-text">
            ¿No tienes una cuenta?<Link to={"/register"}> Regístrate</Link>
          </p>
        </form>
      </div>
    </div>
  )
}

export default LogIn
