import React, { useEffect, useState } from "react";
import "./Perfil.css";
import { useGlobalContext } from "../../context";
import { GiReturnArrow } from "react-icons/gi";
import { useCookies } from "react-cookie";
import SolicitudesPendientes from "../solicitudes/SolicitudesPendientes";
import SolicitudesAceptadas from "../solicitudes/SolicitudesAceptadas";
import HabilitarAmigo from "./HabilitarAmigo";
import MiPerfil from "../../Components/MiPerfil/MiPerfil";
import { useIsEnabledFriendModeQuery } from "./clienteSlice";
import Loading from "../../Components/Loading";
import { useLocation, useNavigate } from "react-router-dom";

const Perfil = () => {
  const navigateTo = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const {
    userData: informacion,
    setIsFriendModeEnabled,
    isFriendModeEnabled,
    setFriendPrice,
  } = useGlobalContext();

  const [showModal, setShowModal] = useState(false);
  const [currentOption, setCurrentOption] = useState(1);
  const [showContent, setShowContent] = useState(false);
  const [cookies, setCookie, removeCookie] = useCookies(["token"]);
  const navigate = useNavigate();

  const [nombreCompleto, setNombreCompleto] = useState("");
  const [imagenBase64, setImagenBase64] = useState("");

  const { data, isFetching, isSuccess } = useIsEnabledFriendModeQuery({
    token: cookies.token,
  });

  const optionsData = [
    {
      id: 1,
      name: "Mi Perfil",
      toRender: <MiPerfil />,
      cliente: true,
    },
    {
      id: 2,
      name: "Solicitudes Pendientes",
      toRender: <SolicitudesPendientes />,
      cliente: false,
    },
    {
      id: 3,
      name: "Encuentros Programados",
      toRender: <SolicitudesAceptadas />,
      cliente: false,
    },
    {
      id: 4,
      name: "Cuenta de Amigo",
      toRender: <HabilitarAmigo modalcito={setShowModal} />,
      cliente: true,
    },
  ];
  useEffect(() => {
    const opcionA = queryParams.get("opcion") || 1;
    if (Number(opcionA) > 4 || Number(opcionA) < 1) {
      setCurrentOption(1);
      return;
    }
    if (!isFriendModeEnabled) {
      if (!optionsData.filter((op) => op.id === Number(opcionA))[0].cliente) {
        setCurrentOption(1);
        return;
      }
    }
    setCurrentOption(Number(opcionA));
  }, [location]);
  useEffect(() => {
    if (informacion) {
      console.log(informacion);
      setNombreCompleto(informacion.nombre_completo);
      setImagenBase64(informacion.imagenBase64);
    }
  }, [informacion]);

  const handleCloseSession = () => {
    removeCookie("token");
    navigate("/");
    window.location.reload();
  };
  const handleOptionClick = (id) => {
    setCurrentOption(id);

    if (window.innerWidth < 576) {
      setShowContent(true);
    }
    navigateTo(`/cuenta-amigo?opcion=${id}`);
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

  useEffect(() => {
    if (isSuccess) {
      console.log(data, "data");
      if (data.data.amigo) {
        setIsFriendModeEnabled(true);
        setFriendPrice(data.data.precio);
      } else {
        setIsFriendModeEnabled(false);
        setFriendPrice(0);
      }
    }
  }, [isFetching, data, setIsFriendModeEnabled, isSuccess]);

  if (isFetching) {
    return <Loading />;
  } else if (isSuccess) {
    return (
      <div className="profile-section">
        {showModal && (
          <div
            className="terminitos position-absolute  top-50 start-50 translate-middle"
            style={{
              zIndex: "3",
              backgroundColor: "rgba(21, 21, 21, 1)",
              width: "70vw",
              height: "70vh",
              padding: "50px 40px",
              borderRadius: "10px",
            }}
          >
            <h1 style={{ color: "white" }}>Términos y condiciones</h1>
            <p
              style={{
                color: "white",
                maxHeight: "80%",
                overflowY: "auto",
                padding: "15px 20px 0 10px",
              }}
            >
              Términos y Condiciones de Uso de Friender <br />
              Por favor, lee estos términos y condiciones de uso cuidadosamente
              antes de utilizar los servicios ofrecidos por Friender. Al acceder
              y utilizar los servicios de Friender, aceptas estar legalmente
              obligado por los términos y condiciones descritos a continuación.
              Si no estás de acuerdo con alguno de estos términos, no utilices
              este sitio web.
              <br />
              <br />
              1. Descripción del Servicio <br />
              Friender es una plataforma en línea que conecta a personas que
              desean encontrar amigos o contratar servicios de compañía con
              individuos que ofrecen dichos servicios a cambio de una tarifa.
              Los usuarios pueden registrarse para ofrecer sus servicios como
              amigo y también buscar amigos disponibles para contratar.
              <br />
              <br />
              2. Registro <br />
              a. Solo personas mayores de edad y residentes legales de Bolivia
              pueden registrarse en Friender. <br />
              b. Al registrarte en Friender, garantizas que toda la información
              proporcionada es precisa, completa y actualizada. <br />
              c. Eres responsable de mantener la confidencialidad de tu cuenta y
              contraseña, y aceptas no compartir esta información con terceros.
              <br />
              <br />
              3. Servicios de Compañía <br />
              a. Los usuarios que ofrecen servicios de compañía en Friender son
              responsables de establecer sus propias tarifas, términos y
              condiciones para la prestación de servicios. <br />
              b. Friender no se hace responsable de la calidad de los servicios
              prestados por los usuarios.
              <br />
              <br />
              4. Uso Adecuado del Servicio <br />
              a. Al utilizar Friender, aceptas no utilizar el servicio para
              fines ilegales o no autorizados. <br />
              b. No debes violar ninguna ley aplicable al utilizar Friender.
              <br />
              <br />
              5. Privacidad <br />
              a. Friender recopila y procesa información personal de acuerdo con
              su Política de Privacidad. Al utilizar el servicio, aceptas el
              procesamiento de tu información personal según esta política.
              <br />
              <br />
              6. Propiedad Intelectual <br />
              a. Todos los derechos de propiedad intelectual relacionados con
              Friender y su contenido pertenecen a Friender o a sus
              licenciantes.
              <br />
              <br />
              7. Limitación de Responsabilidad <br />
              a. Friender no será responsable de ningún daño directo, indirecto,
              incidental, especial o consecuente que surja del uso o la
              imposibilidad de usar el servicio.
              <br />
              <br />
              8. Modificaciones de los Términos y Condiciones <br />
              a. Friender se reserva el derecho de modificar o actualizar estos
              términos y condiciones en cualquier momento sin previo aviso.
              <br />
              <br />
              9. Ley Aplicable <br />
              a. Estos términos y condiciones se rigen por las leyes de Bolivia,
              y cualquier disputa relacionada con ellos se resolverá
              exclusivamente en los tribunales de Bolivia. Al utilizar los
              servicios de Friender, aceptas estos términos y condiciones en su
              totalidad. Si no estás de acuerdo con alguno de estos términos,
              por favor, no utilices este sitio web.
            </p>
            <div
              className="d-flex justify-content-end"
              style={{ paddingTop: "3%" }}
            >
              <button
                className="btn btn-azul"
                onClick={() => {
                  setShowModal(false);
                }}
              >
                Cerrar
              </button>
            </div>
          </div>
        )}
        <div
          className={`profile-section-center ${showContent && "show-content"}`}
        >
          <div className="profile-options">
            <div className="profile-info">
              <div className="profile-image">
                <div
                  className="image"
                  style={{
                    backgroundImage: `url(${
                      imagenBase64
                        ? `data:image/jpeg;base64,${imagenBase64}`
                        : "/images/user.jpeg"
                    })`,
                  }}
                ></div>
              </div>
              <h4>{nombreCompleto}</h4>
            </div>
            <div className="options" style={{ zIndex: "1" }}>
              <ul>
                {optionsData
                  .filter((opcion) => opcion.cliente || isFriendModeEnabled)
                  .map((item) => (
                    <li
                      key={item.id}
                      onClick={() => handleOptionClick(item.id)}
                      className={`option ${
                        currentOption === item.id && "active"
                      }`}
                    >
                      <p>{item.name}</p>
                    </li>
                  ))}
                <li className="option">
                  <li>
                    <button
                      className="dropdown-item "
                      onClick={handleCloseSession}
                    >
                      Cerrar Sesión
                    </button>
                  </li>
                </li>
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
  }
};

export default Perfil;
