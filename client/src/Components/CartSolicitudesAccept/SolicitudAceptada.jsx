import React from 'react'
import "./SolicitudAceptada.css";
import { FaClock } from "react-icons/fa6";
import { FaCalendarAlt, FaMapMarkerAlt } from "react-icons/fa";
import { Link } from "react-router-dom";

const SolicitudAceptada = ( {imagenBase64, 
                            nombre_cliente, 
                            fecha_inicio, 
                            hora_inicio, 
                            lugar, 
                            solicitud_aceptada_id,
                            duracion,
                            dias_restantes
                          } ) => { 
 
  function formatFecha(fecha) {
    const [year, month, day] = fecha.split("-");
    return `${day.padStart(2, "0")}/${month.padStart(2, "0")}/${year}`;
  }
                              
  return (
    <div className="col-container ">
      <div className="solicitud-aceptada-card ">
        <div id="datos-perfil">
          <div id="datos-perfil">
            <div
              className="card-image mb-2"
              style={{
                backgroundImage: `url(${
                  imagenBase64
                    ? `data:image/jpeg;base64,${imagenBase64}`
                    : "/images/user.jpeg"
                })`,
              }}
            ></div>
          </div>
          <h5>{nombre_cliente}</h5>
        </div>
        <div id="datos-solicitud">
          <p className="estrellas text-warning">★★★★☆</p>
          <div className="card-double-item-aceptada">
            <div className="card-item">
              <span>
                <FaCalendarAlt />
              </span>
              <p>{formatFecha(fecha_inicio)}</p>
            </div>
            <div className="card-item">
              <span>
                <FaClock />
              </span>
              <p>{hora_inicio.match(/\d+:\d+/)}</p>
            </div>
          </div>

          <div className="card-item-aceptadas">
            <div>
              <span>
                <FaMapMarkerAlt />
              </span>
              <span>{lugar}</span>
            </div>
            <p>{duracion} Hrs</p>
          </div>
          <div className="align-items-center ">
            {
              dias_restantes===0 ?
              <h5><strong>Hoy</strong></h5>
              :
                dias_restantes===1 ?
                <p>En 1 día</p>
                : <p>En {dias_restantes} días</p>   
            }       
          </div>
        </div>
      </div>
    </div>
  )
}

export default SolicitudAceptada