import React from 'react'
import "./Solicitud.css"

const Solicitud = () => {
    return (
    <div className="card" >
            <div id="datos-perfil">
                <img id="foto-perfil" src="https://lapi.com.mx/web/image/product.template/5138/image_1024?unique=f67111b" alt="foto-perfil"/>
                <p>Nombre de Usuario</p>
            </div>
            <div id="datos-solicitud">
                <p className="estrellas">★★★★☆</p>
                <div>
                    <img className="icono" src="https://w7.pngwing.com/pngs/162/843/png-transparent-computer-icons-calendar-date-others-miscellaneous-text-calendar.png" alt="icono calendario"/>
                    <p>dd/mm/aa</p>
                </div>
                <div>
                    <img className="icono" src="https://w7.pngwing.com/pngs/971/269/png-transparent-clock-computer-icons-clock-cdr-text-time.png" alt="icono hora"/>
                    <p>00:00</p>
                </div>
                <div>
                    <img className="icono" src="https://w7.pngwing.com/pngs/912/661/png-transparent-computer-icons-location-location-icon-map-location-icon-miscellaneous-desktop-wallpaper-map-thumbnail.png" alt="icono ubicacion"/>
                    <p>Bolivia - Cochabamba</p>
                </div>
                <div id="button-box">
                    <button id="ver-perfil-button" type="button">Ver Perfil</button>
                </div>
            </div>
            <p className="hora-solicitud">1h</p>
            <img className="delete-icon" src="https://cdn-icons-png.freepik.com/512/1017/1017530.png" alt="Boton eliminar"/>
    </div>
  )
}

export default Solicitud
