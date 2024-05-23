import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useGetSolicitudPendienteByIdQuery } from '../../features/solicitudes/solicitudesSlice.js';
import Loading from '../../Components/Loading';
import "../../features/solicitudes/SolicitudDetalles.css";
import { FaMapMarkerAlt } from "react-icons/fa";

const calificacionEstrellas = (calificacion) => {
    const numEstrellas = Math.round(calificacion);
    const estrellas = "★".repeat(numEstrellas) + "☆".repeat(5 - numEstrellas);
    return estrellas;
  };
function formatFecha(fecha) {
    const [year, month, day] = fecha.split("-");
    return `${day.padStart(2, "0")}/${month.padStart(2, "0")}/${year}`;
}

const SolicitudDetalle = () => {
    const { id_solicitud } = useParams();
    const { data: solicitud, isFetching, isSuccess } = useGetSolicitudPendienteByIdQuery(id_solicitud);

    if (isFetching) {
        return <Loading />;
    } else if (isSuccess) {
        return (
            <div id="solicitud_detalles" className="page">
                <div className="solicitud-detalles-center">
                    <div className="cliente-info">
                        <div
                            className="profile-image"
                            style={{
                                backgroundImage: `url(${
                                    solicitud.imagenBase64
                                        ? `data:image/jpeg;base64,${solicitud.imagenBase64}`
                                        : "/images/user.jpeg"
                                })`,
                            }}
                        ></div>

                        <h3>{solicitud.nombre_cliente}</h3>
                        <span className="text-warning">{calificacionEstrellas(solicitud.calificacion_cliente)}</span>
                    </div>
                    <div className="solicitud-details">
                        <div className="title">
                            <h1>Detalles de la solicitud</h1>
                        </div>
                        <div className="details">
                            <p>
                                <strong>Fecha: </strong>{" "}
                                {formatFecha(solicitud.fecha_inicio)}
                            </p>
                            <p>
                                <strong>Hora: </strong>{" "}
                                {solicitud.hora_inicio.slice(0, 5)}
                            </p>
                            <p>
                                <strong>Tiempo: </strong> {solicitud.minutos}{" "}
                                {solicitud.minutos === 1 ? "hr" : "hrs"}
                            </p>
                            <p>
                                <strong>Lugar: </strong> {solicitud.lugar}{" "}
                                <span>
                                    <FaMapMarkerAlt />
                                </span>{" "}
                            </p>
                            <p>
                                <strong>Descripción:</strong>
                            </p>
                            <p>{solicitud.descripcion}</p>
                        </div>
                        <div className="footer">
                            <h5>Total: {solicitud.precio} Bs </h5>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default SolicitudDetalle;
