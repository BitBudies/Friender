import React, { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useGetSolicitudPendienteByIdQuery } from './solicitudesSlice';
import Loading from '../../Components/Loading';

const SolicitudDetalles = () => {

    const {id_solicitud} = useParams();

    const {data:solicitud,isFetching,isSuccess} = useGetSolicitudPendienteByIdQuery(id_solicitud)

    useEffect(() => {
        console.log(solicitud)
    },[solicitud])

    if(isFetching){
        return <Loading/>
    }else if(isSuccess){
        return (
            <div id='Solicitud_Detalles' className='page'>
                <div className='solicitud-detalles-center'>
                    <div className='cliente-info'>
                        <div className='profile-image' style={{backgroundImage: "url(/images/user.jpeg)"}}></div>
                        <h4>Kevin Huayllas Pinto</h4>
                        <span>★★★☆☆</span>
                        <p>Edad: 28 años</p>
                        <Link className='btn btn-azul'>Ver Perfil</Link>
                    </div>
                    <div className='solicitud-details'></div>
                </div>
              {id_solicitud}
            </div>
          )   
    }
}

export default SolicitudDetalles
