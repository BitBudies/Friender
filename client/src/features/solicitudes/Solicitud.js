import React from 'react'
import "./Solicitud.css"
import { FaClock } from "react-icons/fa6";
import { FaCalendarAlt,FaMapMarkerAlt } from "react-icons/fa";
import { Link } from 'react-router-dom';



const Solicitud = ({solicitud}) => {
    console.log(solicitud)

    function formatFecha(fecha) {
        const [year, month, day] = fecha.split("-");
        return `${day.padStart(2, "0")}/${month.padStart(2, "0")}/${year}`;
    }

    return (
    <div className='col-container '>
        <div className="solicitud-recibida-card " >
                <div id="datos-perfil">
                    <div className='card-image mb-2' style={{backgroundImage: "url(/images/user.jpeg)"}}>
                    </div>
                    <h5>{solicitud.nombre_cliente}</h5>
                    
                </div>
                <div id="datos-solicitud">
                <p className="estrellas text-warning">★★★★☆</p>
                    <div className='card-double-item'>                       
                        <div className='card-item'>
                            <span><FaCalendarAlt/></span>
                            <p>{formatFecha(solicitud.fecha_inicio)}</p>
                        </div>
                        <div className='card-item'>
                            <span><FaClock/></span>
                            <p>00:00</p>
                        </div>
                    </div>
                    
                    <div className='card-item'>
                        <span><FaMapMarkerAlt/></span>
                        <p>{solicitud.lugar}</p>
                    </div>
                    <div className='d-flex justify-content-between align-items-center'>
                        <Link to={`/usuario/solicitud_pendiente/${solicitud.solicitud_alquiler_id}`} id="ver-perfil-button" className='btn btn-azul' type="button">Ver solicitud</Link>
                        <p >{solicitud.duracion_minutos} Hrs</p>
                    </div>
                </div>
                
        </div>
    </div>
  )
}

export default Solicitud
