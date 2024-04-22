import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import "./RegistrarDatos.css";
import { checkPassword } from "../../hooks/checkRegex";

const defaultValues = {
  nombre: "",
  apellido_paterno: "",
  apellido_materno: "",
  fecha_nacimiento: "",
  genero: "",
  ubicacion: "",
  nombre_usuario: "",
  correo_electronico: "",
  contraseña: "",
  confirmar_contraseña: "",
};

const RegistrarDatos = ({ setNForm }) => {
  const [password, setPassword] = useState("");
  const [password1, setPassword1] = useState("");
  const [values, setValues] = useState(defaultValues);
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword1, setShowPassword1] = useState(false);
  const [errors, setErrors] = useState({});


  const checkPass = checkPassword();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues({
      ...values,
      [name]: value,
    });

    setErrors({
      ...errors,
      [name]: "",
    });
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const toggleShowPassword1 = () => {
    setShowPassword1(!showPassword1);
  };

  const onPasswordChange = (e) => {
    const passwordChecked = checkPass(e.target.value);
    console.log(passwordChecked);
          if(!passwordChecked.pass){
            setErrors((currentErrors) => {
              return {...currentErrors,password : passwordChecked.message}
            });
          }
    setPassword(e.target.value);
  }

  // Función para validar el formulario antes de pasar al siguiente paso
  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    // Validar cada campo y almacenar los errores
    Object.entries(values).forEach(([key, value]) => {
      switch (key) {
        case "nombre":
          if (!value.trim()) {
            newErrors[key] = "El nombre es obligatorio";
            isValid = false;
          }
          break;
        case "apellido_paterno":
          if (!value.trim()) {
            newErrors[key] = "El apellido paterno es obligatorio";
            isValid = false;
          }
          break;
        case "fecha_nacimiento":
          // Validar fecha de nacimiento
          break;
        case "genero":
          if (!value) {
            newErrors[key] = "El género es obligatorio";
            isValid = false;
          }
          break;
        case "nombre_usuario":
          if (!value.trim()) {
            newErrors[key] = "El nombre de usuario es obligatorio";
            isValid = false;
          } else if (value.length < 5 || value.length > 20) {
            newErrors[key] = "La longitud del nombre de usuario debe ser de 5 a 20 caracteres.";
            isValid = false;
          }
          break;
        case "correo_electronico":
          if (!value.trim()) {
            newErrors[key] = "El correo electrónico es obligatorio";
            isValid = false;
          }
          break;
        case "ubicacion":
          if (!value) {
            newErrors[key] = "La ubicación es obligatoria";
            isValid = false;
          }
          
          break;
          case "confirmar_contraseña":
            if (!value.trim()) {
              newErrors[key] = "Confirmar contraseña es obligatorio";
              isValid = false;
            } else if (value !== password) {
              newErrors[key] = "Las contraseñas no coinciden, intente de nuevo.";
              isValid = false;
            }
            break;
          
        default:
          break;
      }
    });

    // Actualizar el estado de los errores
    setErrors(newErrors);

    return isValid;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      setNForm((n) => n + 1);
    }
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
            className="form-control input1m-width-70"
            required
          />
          <p className="text-danger">{errors.nombre}</p>
        </div>
        <div className="mb-2 input-item">
          <label htmlFor="apellido_paterno" className="input-label  input1-width-70 ">
            Apellido Paterno:
          </label>
          <input
            type="text"
            id="apellido_paterno"
            name="apellido_paterno"
            placeholder="Apellido Paterno"
            value={values.apellido_paterno}
            onChange={handleChange}
            className="form-control input-width-160"
            required
          />
          <p className="text-danger input1-width-70">{errors.apellido_paterno}</p>
        </div>
        <div className="mb-2 input-item">
          <label htmlFor="apellido_materno" className="input-label  input1-width-70">
            Apellido Materno:
          </label>
          <input
            type="text"
            id="apellido_materno"
            name="apellido_materno"
            placeholder="Apellido Materno"
            value={values.apellido_materno}
            onChange={handleChange}
            className="form-control input-width-160"
          />
         
        </div>
      </div>
      <div className="input-group registro">
        <div className="mb-2 input-item">
          <label htmlFor="fecha_nacimiento" className="input-label ">
            Fecha de Nacimiento:
          </label>
          
          <input
            type="date"
            id="fecha_nacimiento"
            name="fecha_nacimiento"
            placeholder="dd/mm/aa"
            value={values.fecha_nacimiento}
            onChange={handleChange}
            className="form-control input1f-width-70"
            required
          />
          <p className="text-danger">{errors.fecha_nacimiento}</p>
        </div>
        <div className="mb-2 input-item">
          <label htmlFor="genero" className="input-label input1-width-70" >
            Género:
          </label>
          <select
            id="genero"
            name="genero"
            value={values.genero}
            onChange={handleChange}
            className="form-select input-width-160"
            required
          >
            <option value="" disabled selected hidden>
              ----------
            </option>
            <option value="masculino">Masculino</option>
            <option value="femenino">Femenino</option>
            <option value="otro">Otro</option>
          </select>
          <p className="text-danger input1-width-70">{errors.genero}</p>
        </div>
        <div className="mb-2 input-item">
          <label htmlFor="ubicacion" className="input-label input1-width-70">
            Ubicación:
          </label>
          <div className="ubicacion-input">
            <input
              type="text"
              id="ubicacion"
              name="ubicacion"
              placeholder="Ubicación"
              value={values.ubicacion}
              onChange={handleChange}
              className="form-control input-width-160"
            />
            <FaLocationDot className="ubicacion-icon" />
          </div>
          <p className="text-danger input1-width-70">{errors.ubicacion}</p>
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
            className="form-control input1fv-width-70"
            required
          />
          <p className="text-danger">{errors.nombre_usuario}</p>
        </div>
        <div className="mb-2 input-item">
          <label htmlFor="correo_electronico" className="input-label input-width-30">
            Correo Electrónico:
          </label>
          <input
            type="email"
            id="correo_electronico"
            name="correo_electronico"
            placeholder="ejemplo: @gmail.com"
            value={values.correo_electronico}
            onChange={handleChange}
            className="form-control input-width-280"
            required
          />
          <p className="text-danger input-width-30">{errors.correo_electronico}</p>
        </div>
      </div>

      <div className="input-group registro">
        <div className="mb-2 password-input">
          <label htmlFor="contraseña" className="input-label">
            Contraseña:
          </label>
          <div className="mb-2 password-input">
            <input
              type={showPassword ? "text" : "password"}
              className="form-control input1fv-width-70"
              id="contraseña"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => onPasswordChange(e)}
              required
            />
            <p className="text-danger">{errors.contraseña}</p>
            <span className="password-icon " onClick={toggleShowPassword}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
        </div>
        <div className="mb-2 input-item">
          <label htmlFor="confirmar_contraseña" className="input-label input-width-30">
            Confirmar Contraseña:
          </label>
          <div className="mb-2 password-input">
            <input
              type={showPassword1 ? "text" : "password"}
              id="confirmar_contraseña"
              className="form-control input-width-280"
              placeholder="Confirmar Contraseña"
              value={password1}
              onChange={(e) => setPassword1(e.target.value)}
              required
            />
            <p className="text-danger input-width-30">{errors.confirmar_contraseña}</p>
            <span className="password-icon" onClick={toggleShowPassword1}>
              {showPassword1 ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
        </div>
      </div>
      <div className="para1-boton">
        <button className="btn btn-outline-primary" onClick={handleSubmit}>
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default RegistrarDatos;
