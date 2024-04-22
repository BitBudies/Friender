import React, { useState } from "react";
import "./Registrarse.css";
import { Link, useNavigate } from 'react-router-dom';
import RegistrarDatos from './RegistrarDatos';
import RegistrarDatos2 from './RegistrarDatos2';
import logo from '../../logo-friender.png';


const Registrarse = () => {
  const [nForm, setNForm] = useState(1);

  const props = {
    setNForm,
    nForm,
  };

  return (
      <div className="page regist">
      <div class="registrarse-left">
          <h1 className='mb-4'><b>Friender</b></h1>
          
          <h5><p>¡Enciende la diversión con Friender!</p></h5>
          <h5><p>Alquila amigos y crea momentos</p></h5>
          <h5><p>inolvidables.</p></h5>
          <img className="logo-img" src={logo} alt="icono-friender"></img>
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
            <RegistrarDatos {...props}/>
            <RegistrarDatos2 {...props}/>
          </div>  
        </div>
        
        </div>
      </div>
  );
};

export default Registrarse;
