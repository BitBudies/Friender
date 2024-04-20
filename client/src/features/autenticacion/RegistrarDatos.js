import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { FaLocationDot } from "react-icons/fa6";

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

const RegistrarDatos = () => {
  const [password, setPassword] = useState('');
  const [password1, setPassword1] = useState('');
  const [values, setValues] = useState(defaultValues);
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword1, setShowPassword1] = useState(false);

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

  const toggleShowPassword1 = () => {
    setShowPassword1(!showPassword1);
  };

  return (
    <div className="form-item">
      <div className="input-group registro">
        <div className="input-item">
          <label htmlFor="nombre" className="input-label">
            Nombre:
          </label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            placeholder="Nombre"
            value={values.nombre}
            onChange={handleChange}
            style={{ width: '160px' }}
            className="form-control"
            required
          />
        </div>
        <div className="mb-2 input-item" style={{ marginLeft: '60px' }}>
          <label htmlFor="apellido_paterno" className="input-label">
            Apellido Paterno:
          </label>
          <input
            type="text"
            id="apellido_paterno"
            name="apellido_paterno"
            placeholder="Apellido Paterno"
            value={values.apellido_paterno}
            onChange={handleChange}
            style={{ width: '160px' }}
            className="form-control"
            required
          />
        </div>
        <div className="mb-2 input-item" style={{ marginLeft: '60px' }}>
          <label htmlFor="apellido_materno" className="input-label">
            Apellido Materno:
          </label>
          <input
            type="text"
            id="apellido_materno"
            name="apellido_materno"
            placeholder="Apellido Materno"
            value={values.apellido_materno}
            onChange={handleChange}
            style={{ width: '160px' }}
            className="form-control"
          />
        </div>
      </div>
      <div className="input-group registro">
        <div className="mb-2 input-item">
          <label htmlFor="fecha_nacimiento" className="input-label">
            Fecha de Nacimiento:
          </label>
          <input
            type="date"
            id="fecha_nacimiento"
            name="fecha_nacimiento"
            placeholder="dd/mm/aa"
            value={values.fecha_nacimiento}
            onChange={handleChange}
            style={{ width: '160px' }}
            className="form-control"
            required
          />
        </div>
        <div className="mb-2 input-item" style={{ marginLeft: '60px' }}>
          <label htmlFor="genero" className="input-label">
            Género:
          </label>
          <select
         
            id="genero"
            name="genero"
            value={values.genero}
            onChange={handleChange}
            style={{ width: '160px' }}
            className="form-control"
            required
          >
            
            <option value=""></option>
            <option value="masculino">Masculino</option>
            <option value="femenino">Femenino</option>
            <option value="otro">Otro</option>
          </select>
        </div>
        <div className="mb-2 input-item" style={{ marginLeft: '60px', position: 'relative' }}>
  <label htmlFor="ubicacion" className="input-label">
    Ubicación:
  </label>
  <div style={{ display: 'flex', alignItems: 'center' }}>
    <input
      type="text"
      id="ubicacion"
      name="ubicacion"
      placeholder="Ubicación"
      value={values.ubicacion}
      onChange={handleChange}
      style={{ width: '140px', paddingRight: '30px' }}
      className="form-control"
    />
    <FaLocationDot style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-0%)', color: 'black' }} />
  </div>
</div>
      </div>
      <div className="input-group registro">
        <div className="mb-2 input-item">
          <label htmlFor="nombre_usuario" className="input-label">
            Nombre de Usuario:
          </label>
          <input
            type="text"
            id="nombre_usuario"
            name="nombre_usuario"
            placeholder="Usuario"
            value={values.nombre_usuario}
            onChange={handleChange}
            style={{ width: '280px' }}
            className="form-control"
            required
          />
        </div>
        <div className="mb-2 input-item" style={{ marginLeft: '30px' }}>
          <label htmlFor="correo_electronico" className="input-label">
            Correo Electrónico:
          </label>
          <input
            type="email"
            id="correo_electronico"
            name="correo_electronico"
            placeholder="ejemplo: @gmail.com"
            value={values.correo_electronico}
            onChange={handleChange}
            style={{ width: '280px' }}
            className="form-control"
            required
          />
        </div>
      </div>
      <div className="input-group registro">
        <div className="mb-2 password-input">
          <label htmlFor="contraseña" className="input-label">
            Contraseña:
          </label>
          <input
            type={showPassword ? 'text' : 'password'}
            className="form-control"
            id="contraseña"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: '280px' }}
            required
          />
          <span className="password-icon" onClick={toggleShowPassword} style={{ position: 'absolute', right: '10px', top: '60%', transform: 'translateY(-30%)' }}>
  {showPassword? <FaEyeSlash /> : <FaEye />}
</span>
        </div>
        <div className="mb-2 input-item" style={{ marginLeft: '30px' }}>
          <label htmlFor="confirmar_contraseña" className="input-label">
            Confirmar Contraseña:
          </label>
          <input
            type={showPassword1 ? 'text' : 'password'}
            id="confirmar_contraseña"
            className="form-control"
            placeholder="Confirmar Contraseña"
            value={password1}
            onChange={(e) => setPassword1(e.target.value)}
            style={{ width: '280px' }}
            required
          />
         <span className="password-icon" onClick={toggleShowPassword1} style={{ position: 'absolute', right: '180px', top: '60%', transform: 'translateY(-30%)' }}>
  {showPassword1 ? <FaEyeSlash /> : <FaEye />}
</span>
        </div>
      </div>
      <p className="form-text form-register-text">
        <button className="btn btn-azul">Siguiente</button>
      </p>
    </div>
  );
};

export default RegistrarDatos;
