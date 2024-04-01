import React, { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useGetSolicitudPendienteByIdQuery } from './solicitudesSlice';
import Loading from '../../Components/Loading';

const SolicitudDetalles = () => {

    const {id_solicitud} = useParams();

    const {data:solicitud,isFetching,isSuccess} = useGetSolicitudPendienteByIdQuery(id_solicitud)

    useEffect(() => {
        console.log(solicitud,"solicitud")
    },[solicitud])

    if(isFetching){
        return <Loading/>
    }else if(isSuccess){
        return (
            <div id='Solicitud_Detalles' className='page'>
                <div className='solicitud-detalles-center'>
                    <div className='cliente-info'>
                        <div className='profile-image' style={{backgroundImage: "url(/images/user.jpeg)"}}></div>
                        <h4>{solicitud.nombre_cliente}</h4>
                        <span>★★★☆☆</span>
                        <p>Edad: {solicitud.edad_cliente} años</p>
                        <Link className='btn btn-azul'>Ver Perfil</Link>
                    </div>
                    <div className='solicitud-details'>
                        <h3>Detalles de la solicitud</h3>
                        <p><strong>Fecha: </strong> {solicitud.fecha_inicio}</p>
                        <p><strong>Hora: </strong> {solicitud.hora_inicio}</p>
                        <p><strong>Tiempo: </strong> {solicitud.minutos}</p>
                        <p><strong>Lugar: </strong> {solicitud.lugar}</p>
                        <p><strong>Descripcion:</strong></p>
                        <p>{solicitud.descripcion}</p>
                        <h5>Total: {10 * solicitud.minutos} $us </h5>
                        <div className='btns'>
                            <button className='btn btn-success'>Aceptar</button>
                            <button className='btn btn-danger'>Aceptar</button>

                        </div>
                    </div>
                </div>
            </div>
          )   
    }
}

export default SolicitudDetalles
