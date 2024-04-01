import React from 'react'
import "./Solicitud.css"

const Solicitud = ({solicitud}) => {
    console.log(solicitud)
    return (
    <div className='col col-xl-4 col-lg-6 col-md-12 '>
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
                            <img className="icono-solicitudes-recibidas" src="https://w7.pngwing.com/pngs/162/843/png-transparent-computer-icons-calendar-date-others-miscellaneous-text-calendar.png" alt="icono calendario"/>
                            <p>{solicitud.fecha_inicio}</p>
                        </div>
                        <div className='card-item'>
                            <img className="icono-solicitudes-recibidas" src="https://w7.pngwing.com/pngs/971/269/png-transparent-clock-computer-icons-clock-cdr-text-time.png" alt="icono hora"/>
                            <p>00:00</p>
                        </div>
                    </div>
                    
                    <div className='card-item'>
                        <img className="icono-solicitudes-recibidas" src="https://w7.pngwing.com/pngs/912/661/png-transparent-computer-icons-location-location-icon-map-location-icon-miscellaneous-desktop-wallpaper-map-thumbnail.png" alt="icono ubicacion"/>
                        <p>{solicitud.lugar}</p>
                    </div>
                    <div className='d-flex justify-content-between align-items-center'>
                        <button id="ver-perfil-button" className='btn btn-azul' type="button">Ver solicitud</button>
                        <p >{solicitud.duracion_minutos} H</p>
                    </div>
                </div>
                
        </div>
    </div>
  )
}

export default Solicitud
