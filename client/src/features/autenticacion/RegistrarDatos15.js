import React, { useState, useEffect } from 'react';
import "./RegistrarDatos15.css";
import {
    useSendCodeMutation,
    useVerifyCodeMutation,
  } from "./authSlice";

export const RegistrarDatos15 = ({setNForm}) => {

    const [correo,setCorreo] = useState('')
    const [isButtonVerificarEnabled, setIsButtonVerificarEnabled] = useState(false);

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

    // para el envio de codigos 
    const handleEnviarCodigos = (e) => {
        try {
          const formulario = new FormData();
          formulario.append("correo", correo);
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

    const handleVerificationCodeChange = (e) => {
    //   setSupportingText("");
    //   setVerificationCode(e.target.value);
    }
    
    const handleSubmit = () => {
            setNForm((n) => n + 1);
      };  
    
  return (
    
    <div className='form-item'>
        <div className="verificar-correo-container">
        <p>Su correo es: ,</p>
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
            <button className='btn btn-verde'>
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
                    className='btn btn-azul'
                    onClick={handleSubmit}
                    >
                    Siguiente
                </button> 
            </div>
        </div>
        
    </div>
  )
}
