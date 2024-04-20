

import React, { useState } from 'react';
import "./Registrarse.css";
import { Link, useNavigate } from 'react-router-dom';
import RegistrarDatos from './RegistrarDatos';



const Registrarse = () => {
  
  const [nForm,setNForm] = useState(0);
  const navigate = useNavigate();

  return (/*

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
      */
      <div className="page regist">
      <div class="registrarse-left">
          <h1 className='mb-4'><b>Friender</b></h1>
          <p>¡Enciende la diversión con Friender!</p>
          <p>Alquila amigos y crea momentos
          inolvidables.</p>
          <img className="logo-img" src="https://cdn-icons-png.flaticon.com/512/7081/7081305.png" alt="icono-friender"></img>
      </div>
      <div className='registrarse-right'>
        <div className="form-indicators">
          <div className={`indicator ${nForm === 0 && "active"}`}></div>
          <div className={`indicator ${nForm === 1 && "active"}`}></div>
        </div>
        <h1 className='mb-5'>Regístrate</h1>
        <div className="toColumns"></div>
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