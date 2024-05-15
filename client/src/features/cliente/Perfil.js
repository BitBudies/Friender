import React, { useEffect, useState } from "react";
import "./Perfil.css";
import { useGlobalContext } from "../../context";
import { GiReturnArrow } from "react-icons/gi";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import SolicitudesPendientes from "../solicitudes/SolicitudesPendientes";
import SolicitudesAceptadas from "../solicitudes/SolicitudesAceptadas";
import PerfilCliente from "../cliente/PerfilCliente";
import HabilitarAmigo from "./HabilitarAmigo";
import MiPerfil from "../../Components/MiPerfil/MiPerfil";
import { useIsEnabledFriendModeQuery } from "./clienteSlice";
import Loading from "../../Components/Loading";



const Perfil = () => {
  
  const [showModal, setShowModal] = useState(false);
  const [currentOption, setCurrentOption] = useState(1);
  const [showContent, setShowContent] = useState(false);
  const [cookies, setCookie, removeCookie] = useCookies(["token"]);
  const navigate = useNavigate();
  const { userData: informacion, setIsFriendModeEnabled } = useGlobalContext();

  const [nombreCompleto, setNombreCompleto] = useState("");
  const [imagenBase64, setImagenBase64] = useState("");

  const { data, isFetching, isSuccess } = useIsEnabledFriendModeQuery({
    token: cookies.token,
  });

  const optionsData = [
    // {
    //   id : 1,
    //   name : "Editar Perfil",
    //   toRender : <div className='editar-perfil'><h1>Editar Perfil</h1></div>},
    {
      id: 1,
      name: "Mi Perfil",
      toRender: <MiPerfil />,
    },
    {
      id: 2,
      name: "Solicitudes Pendientes",
      toRender: <SolicitudesPendientes />,
    },
    {
      id: 3,
      id: 3,
      name: "Encuentros Programados",
      toRender: <SolicitudesAceptadas />,
    },
    {
      id: 4,
      name: "Cuenta de Amigo",
      toRender: <HabilitarAmigo modalcito={setShowModal}/>,
    },
  ];
  
  useEffect(() => {
    if (informacion) {
      console.log(informacion);
      setNombreCompleto(informacion.nombre_completo);
      setImagenBase64(informacion.imagenBase64);
      //nombre_completo = informacion.nombre_completo
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
      setIsFriendModeEnabled(data.data);
    }
  }, [isFetching, data, setIsFriendModeEnabled, isSuccess]);

  if (isFetching) {
    return <Loading />;
  } else if (isSuccess) {
    return (
      <div className="profile-section">
        {showModal && (
          <div className="terminitos position-absolute  top-50 start-50 translate-middle"
          style={{
            zIndex: "3",
            backgroundColor: "rgba(0, 0, 0, 0.9)",
            width: "70vw",
            height: "70vh",
            padding: "20px",
            borderRadius: "10px",
          }}
        >
          <h1 style={{ color: 'white' }}>Terminos y condiciones</h1>
          <p style={{ color: 'white', maxHeight: '80%', overflowY: 'auto'}}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Pellentesque quis justo sollicitudin, posuere diam et, lobortis
            velit. Mauris et nulla tortor. Vivamus condimentum finibus augue, a
            consequat justo. Proin id lectus elementum, mattis ligula id, luctus
            ante. Cras aliquam accumsan lacinia. Duis quis elit sem. Fusce lorem
            ipsum, gravida id enim ut, maximus sagittis quam. Praesent faucibus
            congue velit, ut congue arcu eleifend non. Mauris non orci semper,
            eleifend sapien et, sollicitudin velit. Proin vel justo efficitur
            odio cursus congue. Nunc mollis nulla a mauris lacinia, a porta
            dolor lobortis. Duis vehicula sodales sodales. Morbi semper nibh
            quis mi molestie, eu feugiat sapien laoreet. Mauris sed ex ut sem
            dictum dignissim. Maecenas sollicitudin ipsum tortor, nec feugiat
            velit sodales vel. Fusce at elit urna. Quisque in odio diam. Duis
            consequat est ac est rutrum lacinia. Nulla lorem ante, vestibulum id
            hendrerit quis, commodo id leo. Suspendisse non pellentesque urna.
            Phasellus volutpat est dui. Vestibulum elit urna, blandit non tempor
            id, scelerisque quis diam. Suspendisse tempor, felis id accumsan
            euismod, turpis est suscipit neque, tincidunt mattis turpis lorem
            non justo. Morbi vel justo eu velit iaculis suscipit vitae nec
            ipsum. Nunc molestie convallis egestas. Cras bibendum sit amet arcu
            nec ullamcorper. Interdum et malesuada fames ac ante ipsum primis in
            faucibus. Pellentesque habitant morbi tristique senectus et netus et
            malesuada fames ac turpis egestas. Sed consequat, arcu et
            scelerisque auctor, eros ex faucibus lorem, eget cursus nunc lectus
            nec dui. Pellentesque odio ligula, auctor ut tristique facilisis,
            ornare a neque. Aliquam scelerisque tempus arcu vitae tincidunt.
            Phasellus augue enim, venenatis sit amet pharetra quis, mollis vitae
            erat. Aliquam condimentum urna ac ornare finibus. Quisque consequat
            mollis ipsum ac gravida. Praesent scelerisque dignissim nibh quis
            venenatis. Curabitur molestie odio sit amet tellus pharetra
            convallis ut vel massa. Pellentesque a magna quis mi faucibus
            vehicula eu eu sem. Suspendisse et nibh eros. Nullam consectetur
            ipsum nulla, sollicitudin hendrerit sapien vestibulum sit amet. Cras
            eget massa neque. Nulla maximus eleifend laoreet. Ut vehicula purus
            nisi, at bibendum elit hendrerit id. Aenean ante libero, accumsan
            sed arcu et, posuere tempor diam. Vivamus id turpis in justo dapibus
            mattis sed eu ante. Vivamus egestas et nibh fermentum varius. Cras
            consequat nisl nunc, et imperdiet justo viverra id. Pellentesque
            habitant morbi tristique senectus et netus et malesuada fames ac
            turpis egestas. Etiam vel leo non lorem tincidunt vulputate. Aliquam
            sed imperdiet nulla. Cras pretium mollis nisl, in placerat sapien
            cursus sollicitudin. Aliquam porttitor risus eget ultricies
            consequat. Ut sit amet nunc eros. Phasellus quam ligula, faucibus eu
            ligula id, consectetur sodales leo. Maecenas vitae lacinia leo. Nam
            imperdiet leo eget mi ultrices, sed consequat justo ultricies. Donec
            et leo gravida, dapibus lorem eget, pretium mi. Nullam semper odio
            quis efficitur tincidunt. Nunc facilisis lacus dui, quis venenatis
            quam sollicitudin sed. Etiam tristique erat et augue sodales
            laoreet. Praesent id tempus ex. Duis ullamcorper iaculis sapien. In
            mattis ex eu diam vestibulum egestas. Pellentesque lacinia lorem
            aliquet magna ullamcorper ullamcorper. Ut in faucibus magna. Ut non
            tellus id massa ullamcorper aliquet mattis non lorem. In et felis
            lacinia, gravida nulla a, elementum massa. Curabitur blandit lectus
            vel odio vehicula commodo. Pellentesque quis convallis erat, ut
            fringilla nunc. Mauris elit mauris, porta rhoncus lacinia et,
            laoreet nec turpis. Integer scelerisque aliquet lorem non elementum.
            Mauris rhoncus mauris orci, eget blandit felis commodo non. Ut
            sagittis est non enim elementum commodo. Class aptent taciti
            sociosqu ad litora torquent per conubia nostra, per inceptos
            himenaeos. Aliquam a sapien velit. Duis eget sem eget felis
            ultricies ullamcorper. Ut commodo elit non lacinia porttitor.
            Integer semper ligula ligula, ut tincidunt diam faucibus nec.
            Aliquam nec finibus nunc, eget vulputate eros. Morbi gravida magna
            eget ligula lacinia semper. Aenean pulvinar tempus lectus,
            sollicitudin bibendum sapien lobortis a. Nulla dignissim ultrices
            commodo. Praesent semper, ligula in convallis congue, urna nunc
            faucibus ipsum, a ultricies massa leo ut ante. Fusce feugiat eu nunc
            eu porttitor. Suspendisse a magna vitae augue semper gravida. In non
            lacus eu eros lobortis consequat at vitae mauris. Proin in justo ut
            nulla suscipit finibus. Vivamus pellentesque ut nisi in varius. Cras
            consequat vitae sapien sit amet scelerisque. Nam fermentum elementum
            bibendum. Curabitur id molestie nisl.
          </p>
          <div className="d-flex justify-content-end" style={{ padding: '3%' }}>
            <button 
            className="btn btn-primary"
            onClick={() => {setShowModal(false)}}
            >Cerrar</button>
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
            <div 
            className="options"
            style={{zIndex: "5"}}
            >
              <ul>
                {optionsData.map((item) => (
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
