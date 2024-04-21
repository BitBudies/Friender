import React,{useEffect, useState} from 'react'
import { Link, useNavigate } from 'react-router-dom';
import "./Login.css";
import { FaEyeSlash, FaEye } from "react-icons/fa";
import { useLoginMutation } from './authSlice';
import { useGlobalContext } from '../../context';
import NavBar from '../../Components/NavBar.js';
import logo from '../../logo-friender.png';
import { useCookies } from 'react-cookie';

const LogIn = () => {
  const [cookies, setCookie] = useCookies(['token']);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showFeedback, setShowFeedback] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [disableBtn,setDisableBtn] = useState(false);
  const [disableBtnLoading,setDisableBtnLoading] = useState(false);
  const [disableBlockedPasswordBox, setBlockedPasswordBox] = useState(true);

  const navigate = useNavigate();

  const {setClientId} = useGlobalContext();

  const [login, {data: response,isLoading,isSuccess,isError,error}] = useLoginMutation();

  const handleBtn = async(e) => {
    e.preventDefault();
    if(username  && password){
      const form = new FormData()
      form.append("username_or_email", username);
      form.append("password", password);
      await login(form);
    }
  };

  const handleBlockedPasswordBox = () => {
    setBlockedPasswordBox(true);
    setDisableBtn(true);
    setTimeout(() => {
      setDisableBtn(false);
    }, 7000);
  };

  
  
  const checkLoginResponse = () => {
    if(isLoading){
      setDisableBtnLoading(true);
    }
    if(isSuccess){
        setClientId(response.id);       //as;ldjkfl;ashidf 'as
        setCookie('token', response.token);
        navigate("/amigos/page/1");
    }
    if(isError){
      setShowFeedback(true);
    }
  }
  
  
  useEffect(checkLoginResponse,[isError, isLoading, isSuccess, navigate, response, setClientId,error])

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    
    <div className="form-section mw-100 min-vh-100 d-flex flex-column justify-content-rigth align-items-center">
      <div className='login-logo-box'>
        <img src={logo} alt="icono-friender"></img>
        <h1>Friender</h1>
      </div>

      <div className="form-section-rigth login-box">
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
            <p className="text-danger mb-2 login-box-text-danger">
              Contraseña incorrecta
            </p>
          )}
          
          <button className={`btn btn-azul mb-2 button-login ${disableBtnLoading && "disabled"} ${disableBtn && "disabled"}`} onClick={handleBtn}>
            Iniciar Sesión
          </button>
          { disableBtn && (
            <p className="text-danger mb-2 login-box-text-danger">
              Intenta ingresar luego de 60 segundos.
            </p>
          )}
          
          <p className='form-text'>
            <Link to={"/resetPassword"}>¿Haz olvidado la contraseña?</Link>
          </p> 
          
          <div className='login-box-separator'>
            <hr></hr>
            <p>O</p>
            <hr></hr>
          </div>
          <p className="form-text form-register-text">
            ¿No tienes una cuenta?<Link to={"/registrar"}> Regístrate</Link>
          </p>
        </form>
      </div>
      <div className={`flex-column justify-content-rigth align-items-center modal-bloqueo ${disableBlockedPasswordBox ? "hidden" : ""}`}>
        <h2>Se impidió un inicio de sesión sospechoso</h2>
        <br></br>
        <p>Bloqueamos un intento de acceder a tu cuenta porque no estábamos seguros de si  realmente eras tú.</p>
        <br></br>
        <p>Esto sucede cuando detectamos actividades de inicio de sesión inusuales, como el intento de iniciar sesión demasiadas veces.</p>
        <br></br>
        <p>Tendrás que esperar 60 segundos para intentar iniciar sesión nuevamente.</p>
        <br></br>
        <button className={`btn btn-azul mb-2`} onClick={handleBlockedPasswordBox}>
          Entendido
        </button>
      </div>
      
    </div>
  )
}

export default LogIn
