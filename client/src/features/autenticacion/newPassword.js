import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./resetPassword.css";
import { useChangePassMutation, useVerifyTokenCodeQuery } from "./authSlice";
import { FaEyeSlash, FaEye } from "react-icons/fa";
import { checkPassword } from "../../hooks/checkRegex";
import Loading from "../../Components/Loading";
import { useNavigate } from "react-router-dom";

const NewPassword = () => {
  const navigate = useNavigate();
  const { tokencito } = useParams();

  const {
    data: tokencitoRespuesta,
    isLoading: tokencitoCargando,
    isSuccess: tokencitoCorrecto,
    isError: tokencitoIsError,
    error: tokencitoErrorData,
  } = useVerifyTokenCodeQuery(tokencito);

  useEffect(() => {
    if (tokencitoCargando) {
      console.log("cargando");
      setLoading(true);
    }
    if (tokencitoCorrecto) {
      console.log(tokencitoRespuesta);
      setLoading(false);
    }
    if (tokencitoIsError) {
      console.log(tokencitoErrorData);
      setLoading(false);
    }
  }, [
    tokencitoCargando,
    tokencitoCorrecto,
    tokencitoErrorData,
    tokencitoIsError,
    tokencitoRespuesta,
  ]);

  const [loading, setLoading] = useState(false);

  const [step, setStep] = useState(3); // control de pagina
  const [submitClicked, setSubmitClicked] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showPassword1, setShowPassword1] = useState(false);

  const [passwordStatus, setPasswordStatus] = useState({
    pass: false,
    message: "",
  });
  const checkPass = checkPassword();

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  const toggleShowPassword1 = () => {
    setShowPassword1(!showPassword1);
  };

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const onPasswordChange = (e) => {
    setConfirmPassword("");
    const passwordChecked = checkPass(e.target.value);
    const { pass, message } = passwordChecked;
    if (!passwordChecked.pass) {
      console.log(pass, message);
      setPasswordStatus({ ...passwordStatus, pass, message });
    } else {
      setPasswordStatus({ ...passwordStatus, pass: true });
    }
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    const { value } = e.target;
    setConfirmPassword(value);
  };

  // cambio de paginas
  const goToNextStep = () => setStep(step + 1);

  // password change endpoint
  const [
    changePass,
    {
      data: passData,
      isLoading: passLoading,
      isSuccess: passSucess,
      isError: passIsError,
      error: passError,
    },
  ] = useChangePassMutation();

  const handleSubmitPasswordForm = (e) => {
    e.preventDefault();
    setSubmitClicked(true);
    let isValid = true;
    const newErrors = {};

    newErrors["contraseña"] = "";
    newErrors["confirmar_contraseña"] = "";

    if (!password.trim()) {
      newErrors["contraseña"] = "La contraseña es obligatoria";
      isValid = false;
    }

    if (!confirmPassword.trim()) {
      newErrors["confirmar_contraseña"] =
        "Confirmar la contraseña es obligatorio";
      isValid = false;
    } else if (confirmPassword !== password) {
      newErrors["confirmar_contraseña"] =
        "Las contraseñas no coinciden, intente de nuevo.";
      isValid = false;
    } else if (confirmPassword.length < 8) {
      newErrors["confirmar_contraseña"] =
        "La contraseña tiene que ser mayor a 8 caracteres";
      isValid = false;
    }

    setPasswordError(newErrors["contraseña"] || "");
    setConfirmPasswordError(newErrors["confirmar_contraseña"] || "");

    if (isValid) {
      console.log("enviamos el formulario para cambiar password");
      try {
        const formulario = new FormData();
        formulario.append("tokencito", tokencito);
        formulario.append("nuevaContrasena", confirmPassword);
        changePass(formulario);
      } catch (error) {
        console.log(error);
      }
    } else {
    }
  };

  useEffect(() => {
    if (passLoading) {
      console.log("Cargando...");
      setLoading(true);
    } else if (passIsError) {
      setLoading(false);
      console.log("Error:", passError.data.error);
      goToNextStep();
    } else if (passSucess) {
      setLoading(false);
      console.log(passData);
      goToNextStep();
    }
  }, [passLoading, passIsError, passSucess, passError, passData]);

  useEffect(() => {
    if (step === 4) {
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    }
  }, [step]);

  return (
    <div className="page principal">
      {loading ? ( // Verificar estado de carga
        <Loading /> // Indicador de carga
      ) : tokencitoIsError ? (
        <p>{tokencitoErrorData.data.error}</p>
      ) : step === 3 ? (
        <div className="step-3 step-1">
          <div className="ingresa">
            <h1>Ingresa tu nueva contraseña</h1>
          </div>
          <div className="para-form">
            <div className="mb-2 password-input">
              <p className="required-label">Contraseña</p>
              <div
                className={
                  passwordStatus.pass ? "password-match" : "password-no-match"
                }
              >
                <input
                  type={showPassword ? "text" : "password"}
                  className="cont"
                  value={password}
                  onChange={onPasswordChange}
                  placeholder="Contraseña"
                />
                <span
                  className="password-icon"
                  style={{ cursor: "pointer" }}
                  onClick={toggleShowPassword}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
              {submitClicked && passwordError && (
                <p style={{ color: "red" }}>{passwordError}</p>
              )}
              {!passwordStatus.pass && passwordStatus.message && (
                <p className="text-danger mw-100">{passwordStatus.message}</p>
              )}
              <p style={{ color: "#999" }}>Mínimo 8 caracteres</p>
            </div>
            <div className="mb-2 password-input">
              <p className="required-label">Confirmar Contraseña</p>
              <div
                className={
                  passwordStatus.pass && confirmPassword === password
                    ? "password-match"
                    : "password-no-match"
                }
              >
                <input
                  type={showPassword1 ? "text" : "password"}
                  className="rep-cont"
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  placeholder="Confirmar contraseña"
                  disabled={!passwordStatus.pass}
                />
                <span
                  className="password-icon"
                  style={{ cursor: "pointer" }}
                  onClick={toggleShowPassword1}
                >
                  {showPassword1 ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
              {submitClicked && confirmPasswordError && (
                <p style={{ color: "red" }}>{confirmPasswordError}</p>
              )}
            </div>
            <div className="b-confirm">
              <button
                type="submit"
                className="btn btn-azul"
                onClick={handleSubmitPasswordForm}
                disabled={
                  !password.trim() ||
                  !confirmPassword.trim() ||
                  password != confirmPassword ||
                  confirmPassword.length < 8 ||
                  passLoading
                }
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <h1>
            {" "}
            {passIsError
              ? passError.data.error
              : "Se restableció correctamente la contraseña"}
          </h1>
        </div>
      )}
    </div>
  );
};

export default NewPassword;
