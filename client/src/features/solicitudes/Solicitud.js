import React from 'react'
import "./Solicitud.css"

const Solicitud = ({solicitud}) => {
    console.log(solicitud)
    return (
    <div className='col col-lg-4 col-md-6 col-sm-12'>
        <div className="solicitud-recibida-card " >
                <div id="datos-perfil">
                    <div className='card-image' style={{backgroundImage: "url(/images/user.jpeg)"}}>
                    </div>
                    <p>{solicitud.nombre_cliente}</p>
                </div>
                <div id="datos-solicitud">
                    <p className="estrellas">★★★★☆</p>
                    <div>
                        <img className="icono-solicitudes-recibidas" src="https://w7.pngwing.com/pngs/162/843/png-transparent-computer-icons-calendar-date-others-miscellaneous-text-calendar.png" alt="icono calendario"/>
                        <p>{solicitud.fecha_inicio}</p>
                    </div>
                    <div>
                        <img className="icono-solicitudes-recibidas" src="https://w7.pngwing.com/pngs/971/269/png-transparent-clock-computer-icons-clock-cdr-text-time.png" alt="icono hora"/>
                        <p>00:00</p>
                    </div>
                    <div>
                        <img className="icono-solicitudes-recibidas" src="https://w7.pngwing.com/pngs/912/661/png-transparent-computer-icons-location-location-icon-map-location-icon-miscellaneous-desktop-wallpaper-map-thumbnail.png" alt="icono ubicacion"/>
                        <p>{solicitud.lugar}</p>
                    </div>
                    <div id="button-box">
                        <button id="ver-perfil-button" className='btn btn-light' type="button">Ver Perfil</button>
                    </div>
                </div>
                <p className="hora-solicitud">{solicitud.duracion_minutos} H</p>
        </div>
    </div>
  )
}

export default Solicitud
