import React from 'react';
import "./RegistrarDatos15.css";

export const RegistrarDatos15 = ({setNForm}) => {


    const handleSubmit = () => {
        // if (validateForm()) {

            setNForm((n) => n + 1);
        // }
      };  
  return (
    
    <div className='page'>
        <p>Verificar Correo *</p>
        <form>
            <div className='verificar'>
            <input 
            placeholder='Codigo de verificación'
            />
            <button className='btn btn-azul'>
                Enviar Código
            </button>
            </div>
            <button className='btn btn-verde'>
                Verificar
            </button>
            <div className='avanzar'>
                <button className='btn' onClick={() => setNForm((n) => n - 1)}>
                    Anterior
                </button>
                <button 
                    className='btn btn-azul'
                    onClick={handleSubmit}
                    >
                    Siguiente
                </button> 
            </div>
            
            
        </form>
    </div>
  )
}
