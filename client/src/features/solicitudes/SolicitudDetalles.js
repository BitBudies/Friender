import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  useAceptarSolicitudMutation,
  useGetSolicitudPendienteByIdQuery,
  useRechazarSolicitudMutation,
} from "./solicitudesSlice";
import Loading from "../../Components/Loading";
import "./SolicitudDetalles.css";
import { useGlobalContext } from "../../context";
import { FaMapMarkerAlt } from "react-icons/fa";
import Modal from "./Modal";
const calificacionEstrellas = (calificacion) => {
  const numEstrellas = Math.round(calificacion);
  const estrellas = "★".repeat(numEstrellas) + "☆".repeat(5 - numEstrellas);
  return estrellas;
};
const SolicitudDetalles = () => {
  const { id_solicitud } = useParams();
  const [enableBtn, setEnableBtn] = useState(true);
  const { showAlert } = useGlobalContext();
  const navigate = useNavigate();

  const [aceptar] = useAceptarSolicitudMutation();
  const [rechazar] = useRechazarSolicitudMutation();
  const {
    data: solicitud,
    isFetching,
    isSuccess,
  } = useGetSolicitudPendienteByIdQuery(id_solicitud);

  const [modalAttributes, setModalAttributes] = useState({
    show: false,
    type: 1,
  });

  const handleAccept = async () => {
    setEnableBtn(false);
    await aceptar(id_solicitud);
    showAlert("Solicitud Aceptada", "success");
    navigate("/cuenta-amigo");
  };

  const handleCancel = async () => {
    setEnableBtn(false);
    await rechazar(id_solicitud);
    showAlert("Solicitud Rechazada", "danger");
    navigate("/cuenta-amigo");
  };

  function formatFecha(fecha) {
    const [year, month, day] = fecha.split("-");
    return `${day.padStart(2, "0")}/${month.padStart(2, "0")}/${year}`;
  }

  function formatDateTime(timestamp) {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    return `${day}/${month}/${year}  ${hours}:${minutes}:${seconds}`;
  }
  useEffect(() => {
    console.log(solicitud);
  }, [solicitud]);

  if (isFetching) {
    return <Loading />;
  } else if (isSuccess) {
    return (
      <>
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
              <p>Edad: {solicitud.edad_cliente} años</p>
              <span className="text-warning">
                {calificacionEstrellas(solicitud.calificacion_cliente)}
              </span>
              <Link
                to={`/cliente/${solicitud.cliente_id}`}
                className="btn btn-azul btn-lg"
              >
                Ver Perfil
              </Link>
            </div>
            <div className="solicitud-details">
              <div className="title">
                <h1>Detalles de la solicitud</h1>
              </div>
              <div className="details">
                <p>
                  <strong>Fecha: </strong> {formatFecha(solicitud.fecha_inicio)}
                </p>
                <p>
                  <strong>Hora: </strong> {solicitud.hora_inicio.slice(0, 5)}
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
                <p className="fw-light text-secondary">
                  {" "}
                  Fecha solicitud:{" "}
                  {formatDateTime(solicitud.timestamp_registro)}
                </p>
                <h5>Total: {solicitud.precio} Bs </h5>
                <div className="btns">
                  <button
                    onClick={() =>
                      setModalAttributes({
                        ...modalAttributes,
                        show: true,
                        type: 1,
                      })
                    }
                    className={`btn btn-success btn-lg ${
                      !enableBtn && "disabled"
                    }`}
                  >
                    Aceptar
                  </button>
                  <button
                    className={`btn btn-danger btn-lg ${
                      !enableBtn && "disabled"
                    }`}
                    onClick={() =>
                      setModalAttributes({
                        ...modalAttributes,
                        show: true,
                        type: 2,
                      })
                    }
                  >
                    Rechazar
                  </button>
                </div>
              </div>
            </div>
          </div>
          <Modal
            attributes={modalAttributes}
            onConfirm={handleAccept}
            onReject={handleCancel}
            onClose={() =>
              setModalAttributes({ ...modalAttributes, show: false })
            }
          />
        </div>
      </>
    );
  }
};

export default SolicitudDetalles;
