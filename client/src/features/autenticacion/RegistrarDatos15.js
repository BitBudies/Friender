import React, { useState, useEffect } from 'react';
import "./RegistrarDatos15.css";
import {
    useVerifyCodeRegistMutation,
    useSendCodeRegistMutation,
  } from "./authSlice";

export const RegistrarDatos15 = ({setNForm}) => {

    const [correo,setCorreo] = useState('ricardorc26@est.fcyt.umss.edu.bo')
    const [nombre,setNombre] = useState('Ricardo')
    const [paterno,setPaterno] = useState('Rojas')

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
          const formulario = new FormData();
          formulario.append("correo", correo);
          formulario.append("nombre", nombre);
          formulario.append("ap_paterno", paterno);
          sendCode(formulario);
          alert("Se envio correctamente los codigos a:"+{correo});
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
      formulario.append("correo", correo);
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
        <p>Su correo es: {correo},</p>
        <p>por favor haga click en "Enviar Código".</p>
        <p className='required-label'>Verificar Correo</p>
        <form>
            <div className='verificar'>
            <input 
            placeholder='Codigo de verificación'
            type="text"
            onChange={handleVerificationCodeChange}
            />
            <button 
                className='btn btn-azul'
                onClick={handleEnviarCodigos}>
                Enviar Código
            </button>
            </div>
            <button 
                className='btn btn-verde'
                onClick={handleSubmitVerificationCodeForm}>
                Verificar
            </button>
              
        </form>
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
