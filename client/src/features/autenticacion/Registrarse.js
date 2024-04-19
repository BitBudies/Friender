import React, { useState } from 'react';
import "./Registrarse.css";
import { Link, useNavigate } from 'react-router-dom';
import RegistrarDatos from './RegistrarDatos';



const Registrarse = () => {
  
  const [nForm,setNForm] = useState(0);
  const navigate = useNavigate();

  return (
    <div className='registrarse-container'>
      <div className='registrarse-left'>
        <div className="form-section mw-100 min-vh-100 d-flex flex-column justify-content-center align-items-left">
          <div className="title-container">
            <h1 className="title align-left"><b>Friender</b></h1>
            <br />
            <h5 className="title align-left">¡Enciende la diversión con Friender!
              <br />
                      Alquila amigos y crea momentos
              <br />
              inolvidables.</h5>
          </div>

          <div className='login-logo-box align-left'>
            <img className="logo-img" src="https://cdn-icons-png.flaticon.com/512/7081/7081305.png" alt="icono-friender"></img>
          </div>
        </div>
      </div>
      <div className='registrarse-right'>
        <div className="form-indicators">
          <div className={`indicator ${nForm === 0 && "active"}`}></div>
          <div className={`indicator ${nForm === 1 && "active"}`}></div>
        </div>
        <h1 className="title align-right"><b>Regístrate</b></h1>
        <div className='form-registro'>
          <div className="form-carousel" style={{transform: `translate(${nForm * -50}%)`}}>
            <RegistrarDatos/>
          </div>  
        </div>
        
        </div>
      </div>
    
  );
}

export default Registrarse;