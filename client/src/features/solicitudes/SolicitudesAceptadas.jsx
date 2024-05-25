import React from "react";
import "./SolicitudesAceptadas.css";
import SolicitudAceptada from "../../Components/CartSolicitudesAccept/SolicitudAceptada";
import { useGetSolicitudesAceptadasQuery } from "./solicitudesSlice";
import { useCookies } from "react-cookie";
import Loading from "../../Components/Loading";

const SolicitudesAceptadas = () => {
  const [cookies] = useCookies(["token"]);
  const { data, isFetching, isSuccess } = useGetSolicitudesAceptadasQuery(
    cookies.token
  );

  if (isSuccess) {
    console.log(data.solicitudes_recibidas);
  }

  if (isFetching) {
    return <Loading />;
  } else if (isSuccess) {
    return (
      <div className="solicitudes-aceptadas">
        <div className="solicitudes-aceptadas-header">
          <h1 id="titulo-solicitudes">Encuentros Programados</h1>
        </div>
        <div className="aceptadas">
          {data.solicitudes_recibidas.length > 0 ? (
            data.solicitudes_recibidas.map((solicitud) => {
              return (
                <>
                  <SolicitudAceptada
                    key={solicitud.solicitud_alquiler_id}
                    imagenBase64={solicitud.imagenes[0].imagenBase64}
                    nombre_cliente={solicitud.nombre_cliente}
                    fecha_inicio={solicitud.fecha_inicio}
                    hora_inicio={solicitud.hora_inicio}
                    lugar={solicitud.lugar}
                    solicitud_aceptada_id={solicitud.solicitud_alquiler_id}
                    duracion={solicitud.duracion}
                    dias_restantes={solicitud.dias_faltantes}
                    calificacion={solicitud.calificacion_cliente}
                  />
                </>
              );
            })
          ) : (
            <p>No hay encuentros aceptados</p>
          )}
        </div>
      </div>
    );
  }
};

export default SolicitudesAceptadas;
