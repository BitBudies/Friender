import React, { useState, useEffect } from "react";
import "./resetPassword.css";
import { useFindEmailMutation } from "./authSlice";
import { useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  // ------------------------------Buscar email------------------------------
  const [emailText, setEmailText] = useState("");
  const [supportingText, setSupportingText] = useState("");
  const [isButtonEmailEnabled, setIsButtonEmailEnabled] = useState(true);
  const [remainingTime, setRemainingTime] = useState(0);

  const [
    findEmail,
    { data: response, isLoading, isSuccess, isError, error: errorsito },
  ] = useFindEmailMutation();

  const handleEmailChange = (e) => {
    setSupportingText("");
    setEmailText(e.target.value);
    if (remainingTime <= 0) {
      setIsButtonEmailEnabled(true);
    }
  };

  const handleSubmitEmailForm = (e) => {
    e.preventDefault();
    if (emailText.length === 0) {
      setSupportingText("El campo es obligatorio");
      return;
    }
    const formulario = new FormData();
    formulario.append("user_or_email", emailText);
    try {
      findEmail(formulario);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (isLoading) {
      setIsButtonEmailEnabled(false);
    }
    if (isSuccess) {
      setIsButtonEmailEnabled(true);
      goToNextStep();
    }
    if (isError) {
      const tiempoRestante = errorsito.data.tiempo;
      if (tiempoRestante) {
        setRemainingTime(errorsito.data.tiempo);
        console.log(errorsito.data.tiempo);
        const timer = setInterval(() => {
          setRemainingTime((prevTime) => prevTime - 1);
        }, 1000);
        // cuando llegue a 0 lo eliminamos
        setTimeout(() => {
          clearInterval(timer);
          setIsButtonEmailEnabled(true);
        }, errorsito.data.tiempo * 1000);
      } else {
        setSupportingText(errorsito.data.error);
      }
    }
  }, [isError, isLoading, isSuccess, response, errorsito]);

  const goToNextStep = () => setStep(step + 1);

  useEffect(() => {
    if (step === 2) {
      setTimeout(() => {
        navigate("/");
      }, 5000);
    }
  }, [step, navigate]);

  return (
    <div className="page principal">
      {step === 1 && (
        <div className="step-1">
          <h1>Restablecer contraseña</h1>
          <div className="para-form">
            <p>Ingresa tu correo electrónico para buscar tu cuenta.</p>
            <input
              type="email"
              name="user_email"
              value={emailText}
              onChange={handleEmailChange}
              placeholder="Correo electrónico"
              maxLength={255}
              required
            />
            {supportingText.length > 0 && (
              <p style={{ color: "red" }}>{supportingText}</p>
            )}
            {remainingTime > 0 && (
              <p>
                Debe esperar {remainingTime} segundos para enviar otro correo.
              </p>
            )}
            <div className="botones">
              <a href="/login">
                <button className="b-cancelar btn btn-outline-primary">
                  Cancelar
                </button>
              </a>
              <button
                type="submit"
                onClick={handleSubmitEmailForm}
                disabled={!isButtonEmailEnabled}
                className="b-buscar btn btn-azul"
              >
                <p>Buscar cuenta</p>
              </button>
            </div>
          </div>
        </div>
      )}
      {step === 2 && (
        <div className="step-2 step-1">
          <h1>Revisa tu bandeja de entrada</h1>
          <p>
            Se ha enviado un correo electrónico con un enlace para restablecer
            la contraseña
          </p>
        </div>
      )}
    </div>
  );
};

export default ResetPassword;
