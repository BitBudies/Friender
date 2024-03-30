import React from 'react'
import Solicitud from './Solicitud'

const SolicitudesPendientes = () => {
  return (
    <div className='solicitudes-pendientes'>
      <h1>Solicitudes pendientes</h1>
      <div className='solicitudes-pendientes-center'>
        {Array.from({length : 8},(_,index) => <Solicitud/>)}
      </div>
    </div>
  )
}

export default SolicitudesPendientes
