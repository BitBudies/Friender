import React, { useEffect } from 'react';
import Solicitud from './Solicitud';
import "./SolicitudesPendientes.css";
import { useGetSolicitudesQuery } from './solicitudesSlice';
import { useGlobalContext } from '../../context';


const SolicitudesPendientes = () => {

  const {clientId} = useGlobalContext();
  const {data,isFetching,isSuccess} = useGetSolicitudesQuery(clientId)

  useEffect(() => {
    console.log(data,isFetching,isSuccess);
  },[data,isFetching,isSuccess])

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
