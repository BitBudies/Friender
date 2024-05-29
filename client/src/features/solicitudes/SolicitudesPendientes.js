import React from "react";
import Solicitud from "./Solicitud";
import "./SolicitudesPendientes.css";
import { useGetSolicitudesQuery } from "./solicitudesSlice";
import Loading from "../../Components/Loading";
import { useCookies } from "react-cookie";

const SolicitudesPendientes = () => {
  const [cookies] = useCookies(["token"]);
  const token = cookies.token;
  const { data, isFetching, isSuccess } = useGetSolicitudesQuery(token);

  if (isFetching) {
    return <Loading />;
  } else if (isSuccess) {
    return (
      <div className="solicitudes-pendientes">
        <div className="solicitudes-pendientes-header">
          <h1 id="titulo-solicitudes">Solicitudes Recibidas</h1>
        </div>
        <div className="solicitudes-pendientes-center ">
          {data.solicitudes_recibidas.length > 0 ? (
            data.solicitudes_recibidas.map((item, index) => (
              <Solicitud key={index} solicitud={item} index={index} />
            ))
          ) : (
            <p>No hay solicitudes pendientes</p>
          )}
        </div>
      </div>
    );
  }
};

export default SolicitudesPendientes;
