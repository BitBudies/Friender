import React, { useState, useEffect } from 'react';
import "./RegistrarDatos15.css";
import {
    useVerifyCodeRegistMutation,
    useSendCodeRegistMutation,
  } from "./authSlice";

export const RegistrarDatos15 = ({setNForm,data}) => {


    const [btnEnabled,setBtnEnabled] = useState(false);
    const [verificationCode, setVerificationCode] = useState("");
    const [supportingText, setSupportingText] = useState("");

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
        e.preventDefault()
        try {
          const {correo_electronico,nombre,apellido_paterno} = data;
          const formulario = new FormData();
          formulario.append("correo", correo_electronico);
          formulario.append("nombre", nombre);
          formulario.append("ap_paterno", apellido_paterno);
          sendCode(formulario);
          
        } catch (error) {
          console.log(error);
          
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
      }, [codeLoading, codeIsError, codeSucess, errorCodigo, dataCodigo]);

    const handleVerificationCodeChange = (e) => {
      setSupportingText("");
      setVerificationCode(e.target.value);
      console.log(verificationCode)
    }

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
      console.log("Cargando..."); // Log mientras se carga
    } else if (verIsError) {
      console.log("Error:", verError.data.error); // Log en caso de error
      setSupportingText(verError.data.error);
    } else if (verSucess) {
      setBtnEnabled(true);
      setSupportingText("");
      console.log(verData); // Log si la solicitud fue exitosa
      
    }
  }, [verLoading, verIsError, verSucess, verError, verData, setNForm]);
    
  return (
    
    <div className='form-item'>
        <div className="verificar-correo-container">
        <p>Su correo es: {data.correo_electronico},</p>
        <p>por favor haga click en "Enviar Código".</p>
        <p className='required-label'>Verificar Correo</p>
        <form>
            <div className='verificar'>
            <input 
            placeholder='Codigo de verificación'
            type="text"
            onChange={handleVerificationCodeChange}
            className='form-control'
            />
            
            <button 
                className="btn btn-azul"
                onClick={handleEnviarCodigos}>
                Enviar Código
            </button>
            </div>
            
            
        </form>
        <p className='msj-confirm' style={{color: 'green'}}>
            {verSucess ? `Correo verificado exitosamente.` : ``}
        </p>
        <p className='msj-confirm' style={{color: 'red'}}>
            {verIsError ? `Código de verificación incorrecto.` : ``}
        </p>
        <button 
            className={`btn btn-verde ${verificationCode.length !== 5 && "disabled"}`}
            onClick={handleSubmitVerificationCodeForm}>
            Verificar
        </button>
        <div className='avanzar'>
                <button className='btn btn-outline-primary anterior' 
                    onClick={() => setNForm((n) => n - 1)}
                >
                    Anterior
                </button>
                <button 
                    className={`btn btn-azul ${!btnEnabled && "disabled"}`}
                    >
                    Siguiente
                </button> 
            </div>
        </div>
        
    </div>
  )
}
