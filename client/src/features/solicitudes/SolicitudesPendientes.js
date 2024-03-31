import React, { useEffect } from 'react';
import Solicitud from './Solicitud';
import "./SolicitudesPendientes.css";


const SolicitudesPendientes = () => {
  useEffect(() => {
    function ocultarElemento(event) {
        const elementoClickeado = event.target;
        if (elementoClickeado.classList.contains("delete-icon")) {
            elementoClickeado.closest('.card').classList.add("no-visible");
        }
    }

    const closeIcons = document.querySelectorAll('.delete-icon');
    closeIcons.forEach(closeIcon => {
        closeIcon.addEventListener('click', ocultarElemento);
    });
  }, []);
  
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
