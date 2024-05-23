import React, { useState } from "react";
import "./Registrarse.css";
import { Link, useNavigate } from "react-router-dom";
import RegistrarDatos from "./RegistrarDatos";
import RegistrarDatos2 from "./RegistrarDatos2";
import logo from "../../logo-friender.png";
import { RegistrarDatos15 } from "./RegistrarDatos15";
import Preview from "../../Components/imagRegistro/preview";
import { useRedirectIfAuthenticated } from "../../hooks/isAuthenticated";

const Registrarse = () => {
  const redirectIfAuth = useRedirectIfAuthenticated();
  redirectIfAuth();
  const [nForm, setNForm] = useState(0);
  const [data, setData] = useState({});
  const [foto, setFoto] = useState("");
  const props = {
    setNForm,
    nForm,
    data,
    setData,
  };

  return (
    <div className="page regist">
      <div class="registrarse-left">
        <h1 className="mb-4">
          <b>Friender</b>
        </h1>
        <h5>
          <p>¡Enciende la diversión con Friender!</p>
        </h5>
        <h5>
          <p>Alquila amigos y crea momentos</p>
        </h5>
        <h5>
          <p>inolvidables.</p>
        </h5>
        <img className="logo-img" src={logo} alt="icono-friender"></img>
      </div>

      <Preview
        foto={foto}
        handleClose={() => {
          setFoto("");
        }}
      />

      <div className="registrarse-right">
        <div className="form-indicators">
          <div className={`indicator ${nForm === 0 && "active"}`}></div>
          <div className={`indicator ${nForm === 1 && "active"}`}></div>
          <div className={`indicator ${nForm === 2 && "active"}`}></div>
        </div>
        <h1 className="mb-3">Regístrate</h1>
        <div className="form-registro">
          <div
            className="form-carousel"
            style={{ transform: `translate(${nForm * -33.33}%)` }}
          >
            <RegistrarDatos {...props} />
            <RegistrarDatos15 {...props} />
            <RegistrarDatos2
              {...props}
              setPreview={(imagen) => {
                setFoto(imagen);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Registrarse;
