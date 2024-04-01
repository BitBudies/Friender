import React from 'react';
import Solicitud from './Solicitud';
import "./SolicitudesPendientes.css";


const SolicitudesPendientes = () => {
  return (
    <div className='solicitudes-pendientes'>
      <h1 id='titulo-solicitudes'>Solicitudes Recibidas</h1>
      <div className='solicitudes-pendientes-center' id="solicitudes-box">
        {Array.from({length : 8},(_,index) => <Solicitud/>)}
      </div>
    </div>
  )
}

export default SolicitudesPendientes
