import React, { useEffect, useState } from "react";
import { Link, useAsyncError, useParams } from "react-router-dom";
import "./listaAmigos.css";
import { useGetAmigosQuery } from "./amigoSlice";
import Loading from "../../Components/Loading";
import { FaUser } from "react-icons/fa";
import { useGlobalContext } from "../../context";
import { useCookies } from "react-cookie";
import { MdInterests, MdOutlineAttachMoney } from "react-icons/md";
import { BsCalendarRange } from "react-icons/bs";
import { IoLocationSharp } from "react-icons/io5";
import { IoIosPeople } from "react-icons/io";

const calificacionEstrellas = (calificacion) => {
  const numEstrellas = Math.round(calificacion);
  const estrellas = "★".repeat(numEstrellas) + "☆".repeat(5 - numEstrellas);
  return estrellas;
};

const ListaAmigos = () => {
  const [cookies] = useCookies(["token"]);
  const token = cookies.token;

  const { n_page } = useParams();
  const [values, setValues] = useState({ genero: "" }); // Define defaultValues aquí
  const { pageRef, goToBeginning } = useGlobalContext();
  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues({
      ...values,
      [name]: value,
    });
  };

  const {
    data: amigos,
    isFetching,
    isSuccess,
  } = useGetAmigosQuery({
    pagina: n_page,
    limite: 24,
    token,
  });
  const [interesesSeleccionados, SetInteresesSeleccionados] = useState([
    "aa",
    "bb",
    "cc",
  ]);

  if (isFetching) {
    return <Loading />;
  } else if (isSuccess) {
    return (
      <div id="lista_amigos" className="page bg-light" ref={pageRef}>
        <div className="filtrosYBoton">
          <div className="rectangle">
            <div>
              <label htmlFor="genero" className="input-label ">
                <MdInterests />
                Intereses
              </label>
              <select
                id="genero"
                name="genero"
                value={values.genero}
                onChange={handleChange}
                className="form-select"
              >
                <option value="" disabled selected hidden>
                  ----------
                </option>
                <option value="masculino">Masculino</option>
                <option value="femenino">Femenino</option>
                <option value="otro">Otro</option>
              </select>
            </div>

            <div>
              <label htmlFor="genero" className="input-label ">
                <BsCalendarRange /> Rango de edad
              </label>
              <select
                id="genero"
                name="genero"
                value={values.genero}
                onChange={handleChange}
                className="form-select"
              >
                <option value="" disabled selected hidden>
                  ----------
                </option>
                <option value="1">18 a 25</option>
                <option value="2">26 a 35</option>
                <option value="3">36 a 45</option>
              </select>
            </div>

            <div>
              <label htmlFor="genero" className="input-label ">
                <MdOutlineAttachMoney />
                Precio
              </label>
              <div className="precios">
 
                <input type="text" placeholder="Min"/>
                <span> a </span>
                <input type="text" placeholder="Max"/>
              </div>
            </div>

            <div>
              <label htmlFor="genero" className="input-label ">
                <IoIosPeople /> Género
              </label>
              <select
                id="genero"
                name="genero"
                value={values.genero}
                onChange={handleChange}
                className="form-select"
              >
                <option value="" disabled selected hidden>
                  ----------
                </option>
                <option value="masculino">Masculino</option>
                <option value="femenino">Femenino</option>
                <option value="otro">Otro</option>
              </select>
            </div>

            <div>
              <label htmlFor="genero" className="input-label ">
                <IoLocationSharp /> Ubicación
              </label>
              <select
                id="genero"
                name="genero"
                value={values.genero}
                onChange={handleChange}
                className="form-select"
              >
                <option value="" disabled selected hidden>
                  ----------
                </option>
                <option value="c">Cochabamba</option>
                <option value="l">La Paz</option>
                <option value="s">Santa Cruz</option>
                <option value="">...</option>
              </select>
            </div>
          </div>
          <button>Filtrar</button>
        </div>
        <div className="interesesSeleccionados">
          {interesesSeleccionados.map((interes) => {
            return <h1>{interes}</h1>;
          })}
        </div>

        <div className="container-fluid py-5">
          <div className="row row-cols-1 row-cols-lg-4 row-cols-md-3 g-3">
            {amigos["amigos"].map((amigo, index) => {
              return (
                <div key={index} className="col">
                  <div className="card-amigo card card-list">
                    <div
                      className="card-header"
                      style={{
                        backgroundImage: `url(${
                          amigo.imagenBase64
                            ? "data:image/jpeg;base64," + amigo.imagenBase64
                            : "/images/user.jpeg"
                        })`,
                      }}
                    />
                    {/* <h5 className='card-title'>{amigo.cliente_id}</h5> */}
                    <div className="card-body px-4">
                      <h5 className="card-title">{amigo.nombre_completo}</h5>
                      <div className="card-text">
                        <div className="card-stats">
                          <div className="text-warning">
                            {calificacionEstrellas(amigo.calificacion)}
                          </div>
                          <div className="card-n-users">
                            0{" "}
                            <span>
                              <FaUser />
                            </span>
                          </div>
                        </div>
                        <div className="card-actions">
                          <Link
                            to={`/amigos/${amigo.amigo_id}`}
                            className="btn btn-azul "
                          >
                            Ver Perfil
                          </Link>
                          {amigo.precio_amigo} Bs/hr
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {Number(n_page) === amigos.numero_paginas && (
          <p id="mensaje-no-more-results">No existen más resultados</p>
        )}
        <nav aria-label="Page navigation example">
          <ul className="pagination justify-content-center">
            <li className="page-item">
              <Link
                className={`page-link ${Number(n_page) === 1 && "disabled"}`}
                to={`/amigos/page/${
                  Number(n_page) > 1 ? Number(n_page) - 1 : Number(n_page)
                }`}
              >
                {" "}
                {"<"}{" "}
              </Link>
            </li>
            {Array.from({ length: amigos.numero_paginas }, (_, index) => {
              return (
                <li
                  key={index}
                  className={`pagination-item page-item ${
                    Number(n_page) === index + 1 && "active"
                  }`}
                >
                  <Link
                    className={`page-link ${
                      Number(n_page) === index + 1 && "bg-azul-fuerte"
                    }`}
                    to={`/amigos/page/${index + 1}`}
                    onClick={goToBeginning}
                  >
                    {index + 1}
                  </Link>
                </li>
              );
            })}
            <li className="page-item">
              <Link
                className={`page-link ${
                  Number(n_page) === amigos.numero_paginas && "disabled"
                }`}
                onClick={() => goToBeginning}
                to={`/amigos/page/${
                  Number(n_page) < amigos.numero_paginas
                    ? Number(n_page) + 1
                    : Number(n_page)
                }`}
              >
                {">"}
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    );
  }
};

export default ListaAmigos;
