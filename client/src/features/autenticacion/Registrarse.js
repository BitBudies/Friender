import React, { useState } from 'react';
import "./Registrarse.css";
import { Link, useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const defaultValues = {
  nombre: '',
  apellido_paterno: '',
  apellido_materno: '',
  fecha_nacimiento: '',
  genero: '',
  ubicacion: '',
  nombre_usuario: '',
  correo_electronico: '',
  contraseña: '',
  confirmar_contraseña: '',
};

const Registrarse = () => {
  const [values, setValues] = useState(defaultValues);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  
  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues({
      ...values,
      [name]: value,
    });
  };
  const toggleShowPassword = () => {
    setShowPassword(!showPassword); 
  };

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
        <h1 className="title align-right"><b>Regístrate</b></h1>
        <div className="input-group registro">
          <div className="input-item">
            <label htmlFor="nombre" className="input-label">Nombre:</label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              placeholder="Nombre"
              value={values.nombre}
              onChange={handleChange}
              style={{ width: '100px' }}
              className="input-field"
            />
          </div>
          <div className="mb-2 input-item">
            <label htmlFor="apellido_paterno" className="input-label">Apellido Paterno:</label>
            <input
              type="text"
              id="apellido_paterno"
              name="apellido_paterno"
              placeholder="Apellido Paterno"
              value={values.apellido_paterno}
              onChange={handleChange}
              style={{ width: '150px' }}
              className="input-field"
            />
          </div>
          <div className="mb-2 input-item">
            <label htmlFor="apellido_materno" className="input-label">Apellido Materno:</label>
            <input
              type="text"
              id="apellido_materno"
              name="apellido_materno"
              placeholder="Apellido Materno"
              value={values.apellido_materno}
              onChange={handleChange}
              style={{ width: '150px' }}
              className="input-field"
            />
          </div>
          </div>
          <div className="input-group registro">
          <div className="mb-2 input-item">
            <label htmlFor="fecha_nacimiento" className="input-label">Fecha de Nacimiento:</label>
            <input
              type="date"
              id="fecha_nacimiento"
              name="fecha_nacimiento"
              value={values.fecha_nacimiento}
              onChange={handleChange}
              style={{ width: '100px' }}
              className="input-field"
            />
          </div>
          <div className="mb-2 input-item">
            <label htmlFor="genero" className="input-label">Género:</label>
            <input
              type="text"
              id="genero"
              name="genero"
              placeholder="Género"
              value={values.genero}
              onChange={handleChange}
              style={{ width: '100px' }}
              className="input-field"
            />
          </div>
          <div className="mb-2 input-item">
            <label htmlFor="ubicacion" className="input-label">Ubicación:</label>
            <input
              type="text"
              id="ubicacion"
              name="ubicacion"
              placeholder="Ubicación"
              value={values.ubicacion}
              onChange={handleChange}
              style={{ width: '100px' }}
              className="input-field"
            />
          </div>
          </div>
          <div className="input-group registro">
          <div className="mb-2 input-item">
            <label htmlFor="nombre_usuario" className="input-label">Nombre de Usuario:</label>
            <input
              type="text"
              id="nombre_usuario"
              name="nombre_usuario"
              placeholder="Usuario"
              value={values.nombre_usuario}
              onChange={handleChange}
              style={{ width: '200px' }}
              className="input-field"
            />
          </div>
          <div className="mb-2 input-item">
            <label htmlFor="correo_electronico" className="input-label">Correo Electrónico:</label>
            <input
              type="text"
              id="correo_electronico"
              name="correo_electronico"
              placeholder="ejemplo: @gmail.com"
              value={values.correo_electronico}
              onChange={handleChange}
              style={{ width: '200px' }}
              className="input-field"
            />
          </div>
          </div>
          <div className="input-group registro">
          <div className="mb-2 password-input">
          <label htmlFor="contraseña" className="input-label">Contraseña:</label>
            <input
              type={showPassword ? "text" : "password"}
              className="form-control"
              id="password"
              placeholder='Contraseña:'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: '200px' }}
              
            />
            <span className="password-icon" onClick={toggleShowPassword}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          <div className="mb-10 input-item">
            <label htmlFor="confirmar_contraseña" className="input-label">Confirmar Contraseña:</label>
            <input
              type="password"
              id="confirmar_contraseña"
              name="confirmar_contraseña"
              placeholder="Confirmar Contraseña"
              value={values.confirmar_contraseña}
              onChange={handleChange}
              style={{ width: '200px' }}
              className="input-field"
            />
             <span className="password-icon" onClick={toggleShowPassword}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
            
          </div>
          
          <p className="form-text form-register-text">
          <br/> <br/> <br/> <br/> <br/>
            <Link to={"/siguiente"}> Siguiente</Link>
          </p>
        </div>
      </div>
      </div>
    
  );
}

export default Registrarse;
