import React, { useEffect, useState } from "react";
import "./Perfil.css";
import { useGlobalContext } from "../../context";
import { GiReturnArrow } from "react-icons/gi";
import { useCookies } from "react-cookie";
import {useGetClienteInfoQuery} from "./clienteSlice"

import SolicitudesPendientes from "../solicitudes/SolicitudesPendientes";

const optionsData = [
  // {
  //   id : 1,
  //   name : "Editar Perfil",
  //   toRender : <div className='editar-perfil'><h1>Editar Perfil</h1></div>},
  {
    id: 1,
    name: "Solicitudes Pendientes",
    toRender: <SolicitudesPendientes />,
  },
  // {
  //   id:3,
  //   name: 'Configuracion',
  //   toRender: <h1>Configuracion</h1>
  // }
];

const Perfil = () => {
  const [cookies] = useCookies(["token"]);
  const token = cookies.token;
  const [currentOption, setCurrentOption] = useState(1);
  const [showContent, setShowContent] = useState(false);
  const {data: informacion, isFetching, isSuccess, isError, error: responseError} = useGetClienteInfoQuery(token);
  const [nombreCompleto, setNombreCompleto] = useState('')

  useEffect(() => {
    if (isSuccess) {
      console.log(informacion);
      setNombreCompleto(informacion.nombre_completo)
      //nombre_completo = informacion.nombre_completo
    }
    if (isError) {
      console.log(responseError);
    }
  }, [isSuccess, isError])

  const handleOptionClick = (id) => {
    setCurrentOption(id);
    if (window.innerWidth < 576) {
      setShowContent(true);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 576) {
        setShowContent(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="profile-section">
      <div
        className={`profile-section-center ${showContent && "show-content"}`}
      >
        <div className="profile-options">
          <div className="profile-info">
            <div className="profile-image">
              <div
                className="image"
                style={{ backgroundImage: "url(/images/user.jpeg)" }}
              ></div>
            </div>
            <h4>{nombreCompleto}</h4>
          </div>
          <div className="options">
            <ul>
              {optionsData.map((item) => (
                <li
                  key={item.id}
                  onClick={() => handleOptionClick(item.id)}
                  className={`option ${currentOption === item.id && "active"}`}
                >
                  <p>{item.name}</p>
                </li>
              ))}
              {/* <li className='option'>
                        <p>Cerrar Sesión</p>
                      </li> */}
            </ul>
          </div>
        </div>
        <div className="profile-content">
          {optionsData.find((option) => option.id === currentOption).toRender}

          <div className="return-btn" onClick={() => setShowContent(false)}>
            <span>
              <GiReturnArrow />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Perfil;
