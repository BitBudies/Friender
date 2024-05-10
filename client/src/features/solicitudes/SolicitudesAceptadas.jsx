import React from 'react'
import './SolicitudesAceptadas.css'
import SolicitudAceptada from '../../Components/CartSolicitudesAccept/SolicitudAceptada'
import logo from '../../logo-friender.png';
import { useGetSolicitudesAceptadasQuery } from './solicitudesSlice';
import { useCookies } from 'react-cookie';
import Loading from '../../Components/Loading';

const SolicitudesAceptadas = () => {
  
//   const url = URL.createObjectURL(logo)
  const [cookies] = useCookies(["token"]);
  const {data, isFetching, isSuccess} = useGetSolicitudesAceptadasQuery(cookies.token)

  if (isSuccess){
    console.log(data.solicitudes)
  }
  if (isFetching){
    return <Loading />
  } else if (isSuccess){

    return (
      <div className='solicitudes-aceptadas'>
        <div className="solicitudes-aceptadas-header">
          <h1 id="titulo-solicitudes">Encuentros Programados</h1>
        </div>
        <div className='aceptadas'>
          {
            data.solicitudes.map((solicitud) => {
              return (
                <>
                  <SolicitudAceptada 
                    imagenBase64={logo}
                    nombre_cliente={solicitud.cliente}
                    fecha_inicio={solicitud.fecha}
                    hora_inicio={solicitud.hora}
                    lugar={solicitud.ubicacion}
                    solicitud_aceptada_id={4}
                    duracion={solicitud.duracion}
                  />
                </>
              )
            })
          }
          <SolicitudAceptada 
              imagenBase64={logo}
              nombre_cliente={data.solicitudes[0].cliente}
              fecha_inicio={data.solicitudes[0].fecha}
              hora_inicio={data.solicitudes[0].hora}
              lugar={data.solicitudes[0].ubicacion}
              solicitud_aceptada_id={4}
              duracion={data.solicitudes[0].duracion}
          />
        </div>
      </div>
    )
  }
}

export default SolicitudesAceptadas