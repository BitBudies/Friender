import React, { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useGetSolicitudPendienteByIdQuery } from './solicitudesSlice';
import Loading from '../../Components/Loading';
import "./SolicitudDetalles.css";

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
            <div id='solicitud_detalles' className='page'>
                <div className='solicitud-detalles-center'>
                    <div className='cliente-info'>
                        <div className='profile-image' style={{backgroundImage: "url(/images/user.jpeg)"}}></div>
                        <h3>{solicitud.nombre_cliente}</h3>
                        <span className='text-warning'>★★★☆☆</span>
                        <p>Edad: {solicitud.edad_cliente} años</p>
                        <Link to={`/amigos/${solicitud.cliente}`} className='btn btn-azul btn-lg'>Ver Perfil</Link>
                    </div>
                    <div className='solicitud-details'>
                        <div className='title'>
                            <h1>Detalles de la solicitud</h1>
                        </div>
                        <div className='details'>
                            <p><strong>Fecha: </strong> {solicitud.fecha_inicio}</p>
                            <p><strong>Hora: </strong> {solicitud.hora_inicio}</p>
                            <p><strong>Tiempo: </strong> {solicitud.minutos}</p>
                            <p><strong>Lugar: </strong> {solicitud.lugar}</p>
                            <p><strong>Descripcion:</strong></p>
                            <p>{solicitud.descripcion}</p>
                        </div>
                        <div className='footer'>
                            <h5>Total: {10 * solicitud.minutos} $us </h5>
                            <div className='btns'>
                                <button className='btn btn-success btn-lg'>Aceptar</button>
                                <button className='btn btn-danger btn-lg'>Rechazar</button>
                            </div>
                        </div>
                        
                    </div>
                </div>
            </div>
          )   
    }
}

export default SolicitudDetalles
