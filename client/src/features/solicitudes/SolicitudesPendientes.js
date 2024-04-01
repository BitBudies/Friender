import React, { useEffect } from 'react';
import Solicitud from './Solicitud';
import "./SolicitudesPendientes.css";
import { useGetSolicitudesQuery } from './solicitudesSlice';
import { useGlobalContext } from '../../context';
import Loading from '../../Components/Loading';


const SolicitudesPendientes = () => {

  const {clientId} = useGlobalContext();
  const {data,isFetching,isSuccess} = useGetSolicitudesQuery(clientId);

  useEffect(() => {
    console.log(data,isFetching,isSuccess);
  },[data,isFetching,isSuccess])


  if(isFetching){
    return <Loading/>
  }else if(isSuccess){
    return (
      <div className='solicitudes-pendientes'>
        <h1 id='titulo-solicitudes'>Solicitudes Recibidas</h1>
        <div className='solicitudes-pendientes-center '>
          {data.solicitudes_recibidas.map((item,index) => <Solicitud key={index} solicitud={item}/>)}
        </div>
      </div>
    )
  }
  
}

export default SolicitudesPendientes
