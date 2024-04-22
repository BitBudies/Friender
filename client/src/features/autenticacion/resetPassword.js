import React, { useState, useEffect } from "react";
import "./resetPassword.css";
import {
  useFindEmailMutation,
  useSendCodeMutation,
  useVerifyCodeMutation,
  useChangePassMutation,
} from "./authSlice";
import { FaEyeSlash, FaEye } from "react-icons/fa";

const ResetPassword = () => {
  const [step, setStep] = useState(1); // control de pagina
  const [submitClicked, setSubmitClicked] = useState(false);

  // ------------------------------Buscar email------------------------------
  const [emailText, setEmailText] = useState("");
  const [supportingText, setSupportingText] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [isButtonEmailEnabled, setIsButtonEmailEnabled] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword1, setShowPassword1] = useState(false);
  const [
    findEmail,
    { data: response, isLoading, isSuccess, isError, error: errorsito },
  ] = useFindEmailMutation();

  const handleEmailChange = (e) => {
    setIsEmailValid(false);
    setUsuario("");
    setSupportingText("");
    setEmailText(e.target.value);
    if (e.target.value.length > 5) {
      setIsButtonEmailEnabled(true);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const toggleShowPassword1 = () => {
    setShowPassword1(!showPassword1);
  };

  const handleSubmitEmailForm = (e) => {
    e.preventDefault();
    if (isEmailValid) {
      goToNextStep();
    } else {
      const formulario = new FormData();
      formulario.append("correo", emailText);
      try {
        findEmail(formulario);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const checkEmailResponse = () => {
    if (isLoading) {
      setIsButtonEmailEnabled(false);
    }
    if (isSuccess) {
      setIsEmailValid(true);
      setIsButtonEmailEnabled(true);
      setUsuario(response.usuario);
    }
    if (isError) {
      setIsEmailValid(false);
      setSupportingText(errorsito.data.error);
    }
  };

  useEffect(checkEmailResponse, [isError, isLoading, isSuccess, response]);

  // ------------------------------verificacion codigos------------------------------
  const [
    sendCode,
    {
      data: dataCodigo,
      isLoading: codeLoading,
      isSuccess: codeSucess,
      isError: codeIsError,
      error: errorCodigo,
    },
  ] = useSendCodeMutation();
  const [
    verifyCode,
    {
      data: verData,
      isLoading: verLoading,
      isSuccess: verSucess,
      isError: verIsError,
      error: verError,
    },
  ] = useVerifyCodeMutation();
  const [usuario, setUsuario] = useState("");
  const [verificationCode, setVerificationCode] = useState("");

  const handleEnviarCodigos = (e) => {
    try {
      const formulario = new FormData();
      formulario.append("correo", emailText);
      sendCode(formulario);
      alert("Se envio correctamente los codigos");
    } catch (error) {
      console.log(error);
      alert("Ha ocurrido un error al enviar el código.");
    }
  };

  useEffect(() => {
    if (codeLoading) {
      console.log("Cargando..."); // Log mientras se carga
    } else if (codeIsError) {
      console.log("Error:", errorCodigo.data.error); // Log en caso de error
    } else if (codeSucess) {
      console.log(dataCodigo); // Log si la solicitud fue exitosa
    }
  }, [codeLoading, codeIsError, codeSucess, errorCodigo]);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  // Funciones para manejar los cambios en los formularios
  const handleVerificationCodeChange = (e) => {
    setSupportingText("");
    setVerificationCode(e.target.value);
  }
    
  const handlePasswordChange = (e) => setPassword(e.target.value);
  const handleConfirmPasswordChange = (e) => setConfirmPassword(e.target.value);

  // cambio de paginas
  const goToNextStep = () => setStep(step + 1);
  const goToPreviousStep = () => setStep(step - 1);

  // Función para manejar el envío del formulario de código de verificación
  const handleSubmitVerificationCodeForm = (e) => {
    e.preventDefault();
    console.log("aqui verificamos los codigos");
    try {
      const formulario = new FormData();
      formulario.append("correo", emailText);
      formulario.append("codigo", verificationCode);
      verifyCode(formulario);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (verLoading) {
      setSupportingText("");
      console.log("Cargando..."); // Log mientras se carga
    } else if (verIsError) {
      console.log("Error:", verError.data.error); // Log en caso de error
      setSupportingText(verError.data.error);
    } else if (verSucess) {
      setSupportingText("");
      console.log(verData); // Log si la solicitud fue exitosa
      goToNextStep();
    }
  }, [verLoading, verIsError, verSucess, verError]);

  //PASSWORD CONFIRMATION
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
      newErrors["confirmar_contraseña"] = "Confirmar contraseña es obligatorio";
      isValid = false;
    } else if (confirmPassword !== password) {
      newErrors["confirmar_contraseña"] =
        "Las contraseñas no coinciden, intente de nuevo.";
      isValid = false;
    } else if (confirmPassword.length < 8) {
      newErrors["confirmar_contraseña"] = "La contraseña tiene que ser mayor a 8 caracteres";
      isValid = false;
    }



    setPasswordError(newErrors["contraseña"] || "");
    setConfirmPasswordError(newErrors["confirmar_contraseña"] || "");

    if (isValid) {
      console.log(`ahora cambiamos contras`);
      console.log(`correo: ${emailText}, codigo: ${verificationCode}`);
      try {
        const formulario = new FormData();
        formulario.append("correo", emailText);
        formulario.append("codigo", verificationCode);
        formulario.append("nuevaContrasena", confirmPassword);
        changePass(formulario);
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    if (passLoading) {
      console.log("Cargando..."); // Log mientras se carga
    } else if (passIsError) {
      console.log("Error:", passError.data.error); // Log en caso de error
    } else if (passSucess) {
      console.log(passData); // Log si la solicitud fue exitosa
      goToNextStep();
    }
  }, [passLoading, passIsError, passSucess, passError]);

  return (
    <div className="page principal">
      {step === 1 && (
        <div className="step-1">
          <h1>Restablecer contraseña</h1>
          <div className="para-form">
            <h3>Ingresa tu correo electronico para buscar tu cuenta</h3>
            <input
              type="email"
              name="user_email"
              value={emailText}
              onChange={handleEmailChange}
              placeholder="Correo electrónico"
              required
            />
            {supportingText.length > 0 && (
              <p style={{ color: "red" }}>{supportingText}</p>
            )}
            <div className="botones">
              <a href="/">
                <button className="b-cancelar btn">Cancelar</button>
              </a>
              <button
                type="submit"
                onClick={handleSubmitEmailForm}
                disabled={!isButtonEmailEnabled}
                className="b-buscar btn btn-azul"
              >
                {isEmailValid ? <p>Continuar</p> : <p>Buscar cuenta</p>}
              </button>
            </div>
          </div>
        </div>
      )}
      {step === 2 && (
        <div className="step-2 step-1">
          <h1>Código de verificación</h1>
          <h3>Ingresar el código de verificación.</h3>
          <div>
          <input
            type="text"
            value={verificationCode}
            onChange={handleVerificationCodeChange}
            placeholder="Código de verificación"
            required
          />
          <button
            className="btn btn-azul"
            onClick={handleSubmitVerificationCodeForm}
            disabled={verificationCode.length < 5 || supportingText != ""}
          > 
          Verificar
          </button>
          </div>
          {supportingText.length > 0 && (
              <p style={{ color: "red" }}>{supportingText}</p>
            )}
          
         
          <div className="b-enviar">
            <button onClick={handleEnviarCodigos} className="btn btn-azul">
              Enviar código
            </button>
          </div>
        </div>
      )}
      {step === 3 && (
        <div className="step-3 step-1">
          <div className="ingresa">
            <h1>Ingresa tu nueva contraseña</h1>
          </div>
          <div className="para-form">
            <div className="mb-2 password-input">
              <input
                type={showPassword ? "text" : "password"}
                className="cont"
                value={password}
                onChange={handlePasswordChange}
                placeholder="Contraseña"
              />
              <span className="password-icon" onClick={toggleShowPassword}>
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
              {submitClicked && passwordError && (
                <p style={{ color: "red" }}>{passwordError}</p>
              )}
            </div>
            <div className="mb-2 password-input">
              <input
                type={showPassword1 ? "text" : "password"}
                className="rep-cont"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                placeholder="Repetir contraseña"
              />
              <span className="password-icon" onClick={toggleShowPassword1}>
                {showPassword1 ? <FaEyeSlash /> : <FaEye />}
              </span>
              {submitClicked && confirmPasswordError && (
                <p style={{ color: "red" }}>{confirmPasswordError}</p>
              )}
            </div>
            <div className="b-confirm">
              <button type="submit" className="btn btn-azul" onClick={handleSubmitPasswordForm}>
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
      {step === 4 && (
        <div>
          <h1>Se restableció correctamente la contraseña</h1>
        </div>
      )}
    </div>
  );
};

export default ResetPassword;
