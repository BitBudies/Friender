import React, { useCallback, useEffect, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import "./RegistrarDatos.css";
import { checkPassword } from "../../hooks/checkRegex";
import { useRegist1Mutation } from "./authSlice";

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

const RegistrarDatos = ({ setNForm, data, setData }) => {
  const [password, setPassword] = useState("");
  const [password1, setPassword1] = useState("");
  const [values, setValues] = useState(defaultValues);
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword1, setShowPassword1] = useState(false);
  const [errors, setErrors] = useState({});
  const [passwordStatus, setPasswordStatus] = useState({
    pass: false,
    message: "",
  });

  const [
    send,
    {
      data: response,
      isLoading,
      isSuccess,
      isError,
      error: responseError,
      reset,
    },
  ] = useRegist1Mutation();

  const checkPass = checkPassword();

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === "confirmar_contraseña" && value.length > 64) {
      return;
    }
    setValues({
      ...values,
      [name]: value,
    });
    setErrors({
      ...errors,
      [name]: "",
    });
  };

  const handleChangeOnlyLetters = (event) => {
    const { name, value } = event.target;
    // Expresión regular para permitir solo caracteres alfabéticos
    const onlyLettersRegex = /^[a-zA-ZñÑáéíóúÁÉÍÓÚ\s]*$/;
    if (!onlyLettersRegex.test(value)) {
      setErrors({
        ...errors,
        [name]: "",
      });
    } else {
      setValues({
        ...values,
        [name]: value,
      });
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const toggleShowPassword1 = () => {
    setShowPassword1(!showPassword1);
  };

  const onPasswordChange = (e) => {
    setValues((values) => {
      return { ...values, confirmar_contraseña: "" };
    });
    const passwordChecked = checkPass(e.target.value);
    const { pass, message } = passwordChecked;
    if (!passwordChecked.pass) {
      setPasswordStatus({ ...passwordStatus, pass, message });
    } else {
      setPasswordStatus({ ...passwordStatus, pass: true });
    }
    setPassword(e.target.value);
  };

  // Función para validar el formulario antes de pasar al siguiente paso
  const validateForm = useCallback(() => {
    const newErrors = {};
    let isValid = true;

    if (!password.length) {
      setPasswordStatus({
        pass: false,
        message: "El campo Contraseña es obligatorio",
      });
      isValid = false;
    }

    if (!values.fecha_nacimiento.trim()) {
      newErrors.fecha_nacimiento = "La fecha es obligatoria";
      isValid = false;
    } else {
      const birthDate = new Date(values.fecha_nacimiento);
      const currentDate = new Date();
      const minAge = 18;
      const maxAge = 80;

      if (
        isNaN(birthDate) ||
        birthDate > currentDate ||
        birthDate.getFullYear() > currentDate.getFullYear() - minAge ||
        birthDate.getFullYear() < currentDate.getFullYear() - maxAge
      ) {
        newErrors.fecha_nacimiento = "Debe ser mayor de edad";
        isValid = false;
      }
    }
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
            newErrors[key] =
              "La longitud del nombre de usuario debe ser de 5 a 20 caracteres.";
            isValid = false;
          }
          break;
        case "correo_electronico":
          if (!value.trim()) {
            newErrors[key] = "El correo electrónico es obligatorio";
            isValid = false;
          }
          break;
        case "fecha_nacimiento":
          if (!value.trim()) {
            newErrors[key] = "La fecha es obligatoria";
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
          if (!value.trim().length === 0) {
            newErrors[key] = "Confirmar contraseña es obligatorio";
            isValid = false;
          } else if (value !== password) {
            console.log(value, "|", password);
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
  }, [password, values]);

  const handleSubmit = async () => {
    if (validateForm()) {
      const data = {
        usuario: values.nombre_usuario,
        correo: values.correo_electronico,
      };
      send(data);
    }
  };

  useEffect(() => {
    console.log(isSuccess);
    if (isSuccess) {
      setNForm(1);
      setData({ ...data, ...values, contraseña: values.confirmar_contraseña });
      reset();
    }
    if (isError) {
      console.log(responseError);
      const tipoError = responseError.data;
      if (tipoError.username) {
        setErrors({
          ...errors,
          nombre_usuario: tipoError.username,
        });
      } else if (tipoError.email) {
        setErrors({
          ...errors,
          correo_electronico: tipoError.email,
        });
      } else {
        console.log(tipoError.error);
      }
    }
  }, [
    response,
    isLoading,
    isSuccess,
    setNForm,
    validateForm,
    reset,
    setData,
    data,
    values,
  ]);

  return (
    <div className="form-item">
      <div className="input-group registro">
        <div className="input-item">
          <label htmlFor="nombre" className="input-label required-label">
            Nombre
          </label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            placeholder="Nombre"
            value={values.nombre}
            onChange={handleChangeOnlyLetters}
            className="form-control "
            required
          />
          <p className="text-danger">{errors.nombre}</p>
        </div>
        <div className="mb-2 input-item">
          <label
            htmlFor="apellido_paterno"
            className="input-label required-label "
          >
            Apellido Paterno
          </label>
          <input
            type="text"
            id="apellido_paterno"
            name="apellido_paterno"
            placeholder="Apellido Paterno"
            value={values.apellido_paterno}
            onChange={handleChangeOnlyLetters}
            className="form-control"
            required
          />
          <p className="text-danger">{errors.apellido_paterno}</p>
        </div>
        <div className="mb-2 input-item">
          <label htmlFor="apellido_materno" className="input-label ">
            Apellido Materno
          </label>
          <input
            type="text"
            id="apellido_materno"
            name="apellido_materno"
            placeholder="Apellido Materno"
            value={values.apellido_materno}
            onChange={handleChangeOnlyLetters}
            className="form-control "
          />
        </div>
      </div>
      <div className="input-group registro">
        <div className="mb-2 input-item">
          <label
            htmlFor="fecha_nacimiento"
            className="input-label required-label "
          >
            Fecha de Nacimiento
          </label>
          <input
            type="date"
            id="fecha_nacimiento"
            name="fecha_nacimiento"
            placeholder="dd/mm/aa"
            value={values.fecha_nacimiento}
            onChange={handleChange}
            className="form-control "
            required
          />
          <p className="text-danger">{errors.fecha_nacimiento}</p>
        </div>
        <div className="mb-2 input-item">
          <label htmlFor="genero" className="input-label required-label">
            Género
          </label>
          <select
            id="genero"
            name="genero"
            value={values.genero}
            onChange={handleChange}
            className="form-select"
            required
          >
            <option value="" disabled selected hidden>
              ----------
            </option>
            <option value="masculino">Masculino</option>
            <option value="femenino">Femenino</option>
            <option value="otro">Otro</option>
          </select>
          <p className="text-danger">{errors.genero}</p>
        </div>
        <div className="mb-2 input-item">
          <label htmlFor="ubicacion" className="input-label required-label">
            Ubicación
          </label>

          <select
            id="ubicacion"
            name="ubicacion"
            value={values.ubicacion}
            onChange={handleChange}
            className="form-select "
            required
          >
            <option value="" disabled selected hidden>
              ----------
            </option>
            <option value="La Paz">La Paz</option>
            <option value="Santa Cruz">Santa Cruz</option>
            <option value="Cochabamba">Cochabamba</option>
            <option value="Potosi">Potosi</option>
            <option value="Oruro">Oruro</option>
            <option value="Tarija">Tarija</option>
            <option value="Pando">Pando</option>
            <option value="Chuquisaca">Chuquisaca</option>
            <option value="Beni">Beni</option>
          </select>
          <p className="text-danger">{errors.ubicacion}</p>
        </div>
        <div className="mb-2 input-item"></div>{" "}
      </div>

      <div className="input-group registro2">
        <div className="mb-2 input-item">
          <label
            htmlFor="nombre_usuario"
            className="input-label required-label"
          >
            Nombre de Usuario
          </label>
          <input
            type="text"
            id="nombre_usuario"
            name="nombre_usuario"
            placeholder="Usuario"
            value={values.nombre_usuario}
            onChange={handleChange}
            className="form-control "
            required
          />
          <p className="text-danger">{errors.nombre_usuario}</p>
        </div>
        <div className="mb-2 input-item">
          <label
            htmlFor="correo_electronico"
            className="input-label required-label "
          >
            Correo Electrónico
          </label>
          <input
            type="email"
            id="correo_electronico"
            name="correo_electronico"
            placeholder="ejemplo@dominio.com"
            value={values.correo_electronico}
            onChange={handleChange}
            className="form-control "
            required
          />
          <p className="text-danger ">{errors.correo_electronico}</p>
        </div>
      </div>

      <div className="input-group registro2">
        <div className="mb-2 ">
          <label htmlFor="contraseña" className="input-label required-label">
            Contraseña
          </label>
          <div className="mb-2 password-input">
            <div
              className={
                passwordStatus.pass ? "password-match" : "password-no-match"
              }
            >
              <input
                type={showPassword ? "text" : "password"}
                className="form-control "
                id="contraseña"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => onPasswordChange(e)}
                required
              />
              {!passwordStatus.pass && passwordStatus.message && (
                <p className="text-danger mw-100">{passwordStatus.message}</p>
              )}
              <span
                className="password-icon"
                style={{ cursor: "pointer" }}
                onClick={toggleShowPassword}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>
        </div>
        <div className="mb-2">
          <label
            htmlFor="confirmar_contraseña"
            className="input-label required-label "
          >
            Confirmar Contraseña
          </label>
          <div className="mb-2 password-input">
            <div
              className={
                passwordStatus.pass && values.confirmar_contraseña === password
                  ? "password-match"
                  : "password-no-match"
              }
            >
              <input
                type={showPassword1 ? "text" : "password"}
                id="confirmar_contraseña"
                name="confirmar_contraseña"
                className="form-control"
                placeholder="Confirmar Contraseña"
                value={values.confirmar_contraseña}
                onChange={handleChange}
                required
                disabled={!passwordStatus.pass}
              />
              <p className="text-danger ">{errors.confirmar_contraseña}</p>
              <span
                className="password-icon"
                style={{ cursor: "pointer" }}
                onClick={toggleShowPassword1}
              >
                {showPassword1 ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="btn-next-container">
        <button
          className={`btn btn-azul ${isLoading && "disabled"}`}
          onClick={handleSubmit}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default RegistrarDatos;
