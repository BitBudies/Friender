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
    console.log(data.solicitudes,isFetching,isSuccess);
  },[data,isFetching,isSuccess])

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
  
  if(isFetching){
    <Loading/>
  }else{
    return (
      <div className='solicitudes-pendientes'>
        <h1 id='titulo-solicitudes'>Solicitudes pendientes</h1>
        <div className='solicitudes-pendientes-center' id="solicitudes-box">
          {data.solicitudes.map((solicitud,index) => <Solicitud key={index} solicitud={solicitud}/>)}
        </div>
      </div>
    )
  }

  
}

export default SolicitudesPendientes
