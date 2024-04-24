import React from 'react';
import "./RegistrarDatos15.css";

export const RegistrarDatos15 = ({setNForm}) => {


    const handleSubmit = () => {
            setNForm((n) => n + 1);
      };  
    const co = "ricardo.rojas.carvajal@gmail.com"
  return (
    
    <div className='form-item'>
        <div className="verificar-correo-container">
        <p>Su correo es: {co},</p>
        <p>por favor haga click en "Enviar Código".</p>
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
