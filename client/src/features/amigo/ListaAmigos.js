import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "./listaAmigos.css";
import { useGetAmigosQuery } from "./amigoSlice";
import Loading from "../../Components/Loading";
import { FaUser } from "react-icons/fa";
import { useGlobalContext } from "../../context";
import { useCookies } from "react-cookie";
import { MdInterests, MdOutlineAttachMoney } from "react-icons/md";
import { BsCalendarRange } from "react-icons/bs";
import { IoLocationSharp, IoClose } from "react-icons/io5";
import { FaFilter, FaAngleDown, FaAngleUp } from "react-icons/fa";
import { MdCheckBoxOutlineBlank, MdCheckBox } from "react-icons/md";

const calificacionEstrellas = (calificacion) => {
  const numEstrellas = Math.round(calificacion);
  const estrellas = "★".repeat(numEstrellas) + "☆".repeat(5 - numEstrellas);
  return estrellas;
};

const ListaAmigos = () => {
  const [cookies] = useCookies(["token"]);
  const token = cookies.token;

  const { n_page } = useParams();
  const [values, setValues] = useState({
    intereses: [],
    rangoEdad: "",
    precio: { min: "", max: "" },
    genero: "",
    ubicacion: "",
  });

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
    // Aquí deberías pasar los valores de los filtros
    // valores: values
  });

  const [interesesSeleccionados, setInteresesSeleccionados] = useState([
    "aa",
    "bb",
    "cc",
  ]);

  const interesesPermitidos = [
    "Arte y Cultura",
    "Cine y Series",
    "Gastronomía",
    "Idiomas",
    "Lectura",
    "Taekwondo",
    "Tecnología",
  ];

  const ubicacionesPermitidas = [
    "Beni",
    "Chuquisaca",
    "Cochabamba",
    "La Paz",
    "Oruro",
    "Pando",
    "Potosí",
    "Santa Cruz",
    "Tarija",
  ];

  const [generos, SetGeneros] = useState([
    { nombre: "Masculino", estado: false },
    { nombre: "Femenino", estado: false },
    { nombre: "Otro", estado: false },
  ]);

  const [generoDropCheckBox, SetGeneroDropCheckBox] = useState(false);

  function handleGeneroChange(nuevoGenero) {
    const nuevosGeneros = generos.map((genero) => {
      if (genero.nombre === nuevoGenero.nombre) {
        return { ...genero, estado: !nuevoGenero.estado };
      }
      return genero;
    });
    SetGeneros(nuevosGeneros);
  }

  useEffect(() => {
    // Ordenar intereses seleccionados alfabéticamente
    setInteresesSeleccionados(
      interesesSeleccionados.sort((a, b) => a.localeCompare(b))
    );
  }, [interesesSeleccionados]);

  if (isFetching) {
    return <Loading />;
  } else if (isSuccess) {
    return (
      <div id="lista_amigos" className="page bg-light" ref={pageRef}>
        <div className="filtrosYBoton   d-flex justify-content-center">
          <div className="rectangle">
            <div>
              <label htmlFor="intereses" className="input-label">
                <MdInterests />
                Intereses
              </label>
              <select
                id="intereses"
                name="intereses"
                value={values.intereses}
                onChange={handleChange}
                className="form-select"
              >
                {interesesPermitidos.map((interes) => (
                  <option key={interes} value={interes}>
                    {interes}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="rangoEdad" className="input-label">
                <BsCalendarRange /> Rango de edad
              </label>
              <select
                id="rangoEdad"
                name="rangoEdad"
                value={values.rangoEdad}
                onChange={handleChange}
                className="form-select"
              >
                <option value="">----------</option>
                <option value="1">Entre 18 y 25 años</option>
                <option value="2">Entre 25 y 35 años</option>
                <option value="3">Entre 35 y 45 años</option>
                <option value="4">Entre 45 y 55 años</option>
                <option value="5">Entre 55 y 65 años</option>
                <option value="6">Más de 65 años</option>
              </select>
            </div>

            <div>
              <label htmlFor="precio" className="input-label">
                <MdOutlineAttachMoney />
                Precio
              </label>
              <div className="precios">
                <input
                  type="text"
                  placeholder="Min"
                  value={values.precio.min}
                  onChange={(e) =>
                    setValues({
                      ...values,
                      precio: { ...values.precio, min: e.target.value },
                    })
                  }
                />
                <span> a </span>
                <input
                  type="text"
                  placeholder="Max"
                  value={values.precio.max}
                  onChange={(e) =>
                    setValues({
                      ...values,
                      precio: { ...values.precio, max: e.target.value },
                    })
                  }
                />
              </div>
            </div>

            <div className="genero">
              <span>Genero</span>
              <div className="generoDropCheckBox">
                <div onClick={() => SetGeneroDropCheckBox(!generoDropCheckBox)}>
                  Genero {generoDropCheckBox ? <FaAngleUp /> : <FaAngleDown />}
                </div>
                {generoDropCheckBox && (
                  <div class="itemsGenero">
                    {generos.map((genero) => {
                      return (
                        <div
                          className="itemGenero"
                          onClick={() => {
                            handleGeneroChange(genero);
                          }}
                        >
                          {genero.nombre}{" "}
                          {genero.estado ? (
                            <MdCheckBox />
                          ) : (
                            <MdCheckBoxOutlineBlank />
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="ubicacion" className="input-label">
                <IoLocationSharp /> Ubicación
              </label>
              <select
                id="ubicacion"
                name="ubicacion"
                value={values.ubicacion}
                onChange={handleChange}
                className="form-select"
              >
                <option value="">----------</option>
                {ubicacionesPermitidas.map((ubicacion) => (
                  <option key={ubicacion} value={ubicacion}>
                    {ubicacion}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="btn-container">
            <button className="btn btn-azul mt-3 btn-solicitar">
              <FaFilter /> Filtrar
            </button>
          </div>
        </div>
        <div className="interesesSeleccionados">
          {interesesSeleccionados.map((interes) => (
            <div key={interes} className="burbujaInteres">
              {interes}{" "}
              <IoClose
                className="cerrarBurbuja"
                onClick={() =>
                  setInteresesSeleccionados(
                    interesesSeleccionados.filter((i) => i !== interes)
                  )
                }
              />
            </div>
          ))}
        </div>

        <div className="container-fluid py-5">
          <div className="row row-cols-1 row-cols-lg-4 row-cols-md-3 g-3">
            {amigos["amigos"].map((amigo, index) => (
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
            ))}
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
            {Array.from({ length: amigos.numero_paginas }, (_, index) => (
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
            ))}
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
