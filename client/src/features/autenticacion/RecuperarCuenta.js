import React, { useEffect, useState } from "react";
import "./RecuperarCuenta.css";
import { useRedirectIfAuthenticated } from "../../hooks/isAuthenticated";

const RecuperarCuenta = () => {
  const redirectIfAuth = useRedirectIfAuthenticated();
  redirectIfAuth();
  const [x, setX] = useState(0);

  return (
    <div className="page  recuperar bg-primary">
      <div className="container-recuperar">
        <div className="box"></div>
        <div className="box1">
          <div className="btns">
            <div className="btn-item"></div>
            <div className="btn-item"></div>
          </div>
          <div className="form">
            <div
              className="form-carousel"
              style={{ transform: `translateX(${x}%)` }}
            >
              <div className="form-item"></div>
              <div className="form-item"></div>
            </div>
          </div>
          <button
            onClick={() => {
              setX(x < 0 ? 0 : -50);
            }}
          >
            Cambiar
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecuperarCuenta;
