import React from 'react'
import './SolicitudesAceptadas.css'
import SolicitudAceptada from '../../Components/CartSolicitudesAccept/SolicitudAceptada'
import logo from '../../logo-friender.png';

const SolicitudesAceptadas = () => {
  
//   const url = URL.createObjectURL(logo)

  return (
    <div className='page'>
        <div className='aceptadas'>
            <div>
              <SolicitudAceptada 
                imagenBase64={logo} 
                nombre_cliente={"Raul"}
                fecha_inicio={"26-12-2024"}
                hora_inicio={"12:20"}
                lugar={"Parque Lincon"}
                solicitud_aceptada_id={4}
                duracion={1}
              />
            </div>
        </div>
    </div>
  )
}

export default SolicitudesAceptadas