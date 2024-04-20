import React, { useState, useEffect } from 'react';
import "./resetPassword.css"
import { useFindEmailMutation, useSendCodeMutation, useVerifyCodeMutation, useChangePassMutation } from './authSlice';

const ResetPassword = () => {
    const [step, setStep] = useState(1); // control de pagina
    // ------------------------------Buscar email------------------------------
    const [emailText, setEmailText] = useState("");
    const [supportingText, setSupportingText] = useState("");
    const [isEmailValid, setIsEmailValid] = useState(false);
    const [isButtonEmailEnabled, setIsButtonEmailEnabled] = useState(false);
    const [findEmail, {data: response, isLoading,isSuccess,isError, error: errorsito}] = useFindEmailMutation()
    const handleEmailChange = (e) => {
        setIsEmailValid(false);
        setUsuario("");
        setSupportingText("");
        setEmailText(e.target.value);
        if (e.target.value.length > 5) {
            setIsButtonEmailEnabled(true);
        }
    };
    const handleSubmitEmailForm = (e) => {
        e.preventDefault();
        if (isEmailValid) {
            goToNextStep();
        } else {
            const formulario = new FormData();
            formulario.append("correo", emailText);
            try {
                findEmail(formulario)
            } catch (error) {
                console.error(error);
            }
        }
    };
    const checkEmailResponse = () => {
        if (isLoading) {
            setIsButtonEmailEnabled(false)
        }
        if (isSuccess){
            setIsEmailValid(true);
            setIsButtonEmailEnabled(true);
            setUsuario(response.usuario);
        }
        if(isError) {
            setIsEmailValid(false);
            setSupportingText(errorsito.data.error)
        }
    }
    useEffect(checkEmailResponse,[isError, isLoading, isSuccess, response])

    // ------------------------------verificacion codigos------------------------------
    const [sendCode, {data: dataCodigo, isLoading: codeLoading, isSuccess: codeSucess, isError:codeIsError, error: errorCodigo}] = useSendCodeMutation()
    const [verifyCode, {data: verData, isLoading: verLoading, isSuccess: verSucess, isError:verIsError, error: verError}] = useVerifyCodeMutation()
    const [usuario, setUsuario] = useState(""); 
    const [verificationCode, setVerificationCode] = useState("");

    const handleEnviarCodigos = (e) => {
      try {
        const formulario = new FormData();
        formulario.append("correo", emailText);
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
    }, [codeLoading, codeIsError, codeSucess, errorCodigo]);

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    // Funciones para manejar los cambios en los formularios
    const handleVerificationCodeChange = (e) => setVerificationCode(e.target.value);
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
        console.log("Cargando..."); // Log mientras se carga
      } else if (verIsError) {
        console.log("Error:", verError.data.error); // Log en caso de error
      } else if (verSucess) {
        console.log(verData); // Log si la solicitud fue exitosa
        goToNextStep();
      }
    }, [verLoading, verIsError, verSucess, verError]);


    //PASSWORD CONFIRMATION
    const [changePass, {data: passData, isLoading: passLoading, isSuccess: passSucess, isError:passIsError, error: passError}] = useChangePassMutation()
    
    const handleSubmitPasswordForm = (e) => {
        e.preventDefault();
        if(password===confirmPassword) {
          console.log(`ahora cambiamos contras`);
          console.log(`correo: ${emailText}, codigo: ${verificationCode}`);
          try {
            const formulario = new FormData();
            formulario.append("correo", emailText);
            formulario.append("codigo", verificationCode);
            formulario.append("nuevaContrasena", confirmPassword)
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
      <div className='page'>
        {step === 1 && (
          <div>
            <h2>Olvidaste tu contraseña</h2>
            <form onSubmit={handleSubmitEmailForm}>
              <input type="email" name="user_email" value={emailText} onChange={handleEmailChange} placeholder="Correo electrónico" required/>
              <button type="submit" disabled={!isButtonEmailEnabled}>{
                isEmailValid ? <p>Continuar</p>: <p>Buscar cuenta</p>}</button>
                {supportingText.length > 0 && (
                    <p style={{color:'red'}}>{supportingText}</p>
                )}
            </form>
          </div>
        )}
        {step === 2 && (
          <div>
            <h1>Hola {usuario}.</h1>
            <h3>Ingresar el código de verificación.</h3>
            <form onSubmit={handleSubmitVerificationCodeForm}>
              <input type="text" value={verificationCode} onChange={handleVerificationCodeChange} placeholder="Código de verificación" required />
              <button type="submit">Verificar</button>
            </form>
            <button onClick={handleEnviarCodigos}>Enviar codigo</button>
          </div>
        )}
        {step === 3 && (
          <div>
            <h2>Ingresa tu nueva contraseña</h2>
            <form onSubmit={handleSubmitPasswordForm}>
              <input type="password" value={password} onChange={handlePasswordChange} placeholder="Contraseña" required />
              <input type="password" value={confirmPassword} onChange={handleConfirmPasswordChange} placeholder="Confirmar contraseña" required />
              <button type="submit">Confirmar</button>
            </form>
          </div>
        )}
        {step === 4 && (
          <div>
            <h1>Se restablecio correctamente la contraseña</h1>
          </div>
        )}
      </div>
    );
  };
  
  export default ResetPassword;