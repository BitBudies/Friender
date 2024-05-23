import React, { useState, useEffect } from "react";
import "./RegistrarDatos15.css";
import {
  useVerifyCodeRegistMutation,
  useSendCodeRegistMutation,
} from "./authSlice";

export const RegistrarDatos15 = ({ setNForm, data }) => {
  const [btnEnabled, setBtnEnabled] = useState(false);
  const [btnEnabledSend, setBtnEnabledSend] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [supportingText, setSupportingText] = useState("");
  const [remainingTime, setRemainingTime] = useState(0);

  const [
    sendCode,
    {
      data: dataCodigo,
      isLoading: codeLoading,
      isSuccess: codeSucess,
      isError: codeIsError,
      error: errorCodigo,
    },
  ] = useSendCodeRegistMutation();

  const [
    verifyCode,
    {
      data: verData,
      isLoading: verLoading,
      isSuccess: verSucess,
      isError: verIsError,
      error: verError,
    },
  ] = useVerifyCodeRegistMutation();

  // para el envio de codigos
  const handleEnviarCodigos = (e) => {
    e.preventDefault();
    try {
      const { correo_electronico, nombre, apellido_paterno } = data;
      const formulario = new FormData();
      formulario.append("correo", correo_electronico);
      formulario.append("nombre", nombre);
      formulario.append("ap_paterno", apellido_paterno);
      // formulario.append("correo", "ricardorc26@est.fcyt.umss.edu.bo");
      // formulario.append("nombre", "asdf");
      // formulario.append("ap_paterno", "asd");
      sendCode(formulario);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (codeLoading) {
      console.log("Cargando..."); // Log mientras se carga
    } else if (codeIsError) {
      const tiempoRestante = errorCodigo.data.tiempo;
      if (tiempoRestante) {
        setRemainingTime(tiempoRestante);
        console.log(tiempoRestante);
        const timer = setInterval(() => {
          setRemainingTime((prevTime) => prevTime - 1);
        }, 1000);
        // cuando llegue a 0 lo eliminamos
        setTimeout(() => {
          clearInterval(timer);
        }, tiempoRestante * 1000);
      } else {
        console.log("Error:", errorCodigo.data.error); // Log en caso de error
      }
    } else if (codeSucess) {
      console.log(dataCodigo); // Log si la solicitud fue exitosa

      const tiempoRestante = dataCodigo.tiempo;
      if (tiempoRestante) {
        setRemainingTime(tiempoRestante);
        console.log(tiempoRestante);
        const timer = setInterval(() => {
          setRemainingTime((prevTime) => prevTime - 1);
        }, 1000);
        // cuando llegue a 0 lo eliminamos
        setTimeout(() => {
          clearInterval(timer);
        }, tiempoRestante * 1000);
      } else {
        console.log("Error:", errorCodigo.data.error); // Log en caso de error
      }
    }
  }, [codeLoading, codeIsError, codeSucess, errorCodigo, dataCodigo]);

  const handleVerificationCodeChange = (e) => {
    setSupportingText("");
    setVerificationCode(e.target.value);
    console.log(verificationCode);
  };

  // Función para manejar el envío del formulario de código de verificación
  const handleSubmitVerificationCodeForm = (e) => {
    e.preventDefault();
    console.log("aqui verificamos los códigos");
    try {
      const formulario = new FormData();
      formulario.append("correo", data.correo_electronico);
      formulario.append("codigo", verificationCode);
      verifyCode(formulario);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (verLoading) {
      setSupportingText("");
      console.log("Cargando...");
    } else if (verIsError) {
      console.log("Error:", verError.data.error);
      setSupportingText(verError.data.error);
    } else if (verSucess) {
      setBtnEnabled(true);
      setSupportingText("");
      console.log(verData);
    }
  }, [verLoading, verIsError, verSucess, verError, verData, setNForm]);

  return (
    <div className="form-item">
      <div className="verificar-correo-container">
        <p>Su correo es: {data.correo_electronico},</p>
        <p>por favor haga click en "Enviar Código".</p>
        <p className="required-label">Verificar Correo</p>
        <form>
          <div className="verificar">
            <input
              placeholder="Codigo de verificación"
              type="text"
              onChange={handleVerificationCodeChange}
              className="form-control"
            />

            <button
              className={`btn btn-azul`}
              disabled={codeLoading || remainingTime > 0}
              onClick={handleEnviarCodigos}
            >
              Enviar Código
            </button>
          </div>
        </form>
        {remainingTime > 0 && (
          <p style={{ color: "gray" }}>
            Debe esperar {remainingTime} segundos para enviar otro correo.
          </p>
        )}
        <p className="msj-confirm" style={{ color: "red" }}>
          {/* {codeSucess ? `${segundo}` : ``} */}
        </p>
        <p className="msj-confirm" style={{ color: "green" }}>
          {verSucess ? `Correo verificado exitosamente.` : ``}
        </p>
        <p className="msj-confirm" style={{ color: "red" }}>
          {verIsError ? `Código de verificación incorrecto.` : ``}
        </p>
        <button
          className={`btn btn-verde 
              ${verificationCode.length !== 5 && "disabled"}
              para-verificar`}
          onClick={handleSubmitVerificationCodeForm}
        >
          Verificar
        </button>
        <div className="avanzar">
          <button
            className="btn btn-outline-primary anterior"
            onClick={() => setNForm((n) => n - 1)}
          >
            Anterior
          </button>
          <button
            className={`btn btn-azul ${!btnEnabled && "disabled"}`}
            onClick={() => setNForm((n) => n + 1)}
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
};
