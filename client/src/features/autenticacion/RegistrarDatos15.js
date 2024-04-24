import React from 'react';
import "./RegistrarDatos15.css";

export const RegistrarDatos15 = ({setNForm}) => {


    const handleSubmit = () => {
            setNForm((n) => n + 1);
      };  
  return (
    
    <div className='form-item'>
        <div className="verificar-correo-container">
        <p className='required-label'>Verificar Correo</p>
        <form>
            <div className='verificar'>
            <input className='verificar-codigo-input'
            placeholder='Código de verificación'
            />
            <button className='btn btn-azul'>
                Enviar Código
            </button>
            </div>
            <button className='btn btn-verde'>
                Verificar
            </button>
              
        </form>
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
        </div>
        
    </div>
  )
}
