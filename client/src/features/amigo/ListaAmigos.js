import React, { useEffect, useState, useRef } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import "./listaAmigos.css";
import Loading from "../../Components/Loading";
import { useGetAmigosMutation } from "./amigoSlice";
import { FaUser, FaFilter, FaAngleDown, FaAngleUp } from "react-icons/fa";
import {
  MdInterests,
  MdOutlineAttachMoney,
  MdCheckBoxOutlineBlank,
  MdCheckBox,
} from "react-icons/md";
import { BsCalendarRange } from "react-icons/bs";
import { IoPeople, IoLocationSharp, IoClose } from "react-icons/io5";
import { useGlobalContext } from "../../context";
import { useCookies } from "react-cookie";

function calificacionEstrellas(calificacion) {
  const numEstrellas = Math.round(calificacion);
  const estrellas = "★".repeat(numEstrellas) + "☆".repeat(5 - numEstrellas);
  return estrellas;
}

const ListaAmigos = () => {
  const [cookies] = useCookies(["token"])
  const token = cookies.token
  const validNumberPattern = /^[0-9+-]*$/

  const queryParams = new URLSearchParams(useLocation().search)
  const pagina = queryParams.get("pagina") || 1
  const edadP = queryParams.get("edad")
  const generoP = queryParams.getAll("genero")
  const interesesP = queryParams.getAll("intereses")
  const precio_minP = queryParams.get("precio_min") || ""
  const precio_maxP = queryParams.get("precio_max") || ""
  const ubicacionP = queryParams.get("ubicacion") || "0"

  console.log(ubicacionP)

  let precioMinimo = parseInt(precio_minP);
  let precioMaximo = parseInt(precio_maxP);
  if (!isNaN(precioMinimo)) {
    if (precioMinimo < 0 || precioMinimo > 999999) {
      precioMinimo = 0 / 0;
    }
  }
  if (!isNaN(precioMaximo)) {
    if (precioMaximo < 0 || precioMaximo > 999999) {
      precioMaximo = 0 / 0;
    }
  }

  const [values, setValues] = useState({
    interecitos: [],
    rangoEdad: "",
    precio: {
      min: isNaN(precioMinimo) ? "" : precioMinimo.toString(),
      max: isNaN(precioMaximo) ? "" : precioMaximo.toString(),
    },
    generosos: [],
    ubicacion: "",
  });

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.target.blur(); // Quitamos el focus del input jiji
    }
  };

  const { pageRef, goToBeginning } = useGlobalContext();
  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues({
      ...values,
      [name]: value,
    });
  };

  const [getAmiwitos, { data: amigos, isLoading, isSuccess }] =
    useGetAmigosMutation();
  
  useEffect(() => {
    getAmiwitos({
      pagina: pagina,
      limite: 24,
      token: token,
      filtros: {
        precio_min: isNaN(precioMinimo) ? null : precioMinimo,
        precio_max: isNaN(precioMaximo) ? null : precioMaximo,
        edad_min: 0,
        edad_max: 999,
        generos: {},
        interes: {},
        ubicacion: "",
      },
    });
  }, [pagina]);

  function ActualizarListaAmigos() {
    console.log(values);
    const generosLetra = values.generosos.map((genero) =>
      genero.charAt(0).toUpperCase()
    );
    const rangoEdad = values.rangoEdad;

    let edad_min, edad_max;
    if (rangoEdad === "0") {
      edad_min = null;
      edad_max = null;
    } else if (rangoEdad === "1") {
      edad_min = 18;
      edad_max = 25;
    } else if (rangoEdad === "2") {
      edad_min = 25;
      edad_max = 35;
    } else if (rangoEdad === "3") {
      edad_min = 35;
      edad_max = 45;
    } else if (rangoEdad === "4") {
      edad_min = 45;
      edad_max = 55;
    } else if (rangoEdad === "5") {
      edad_min = 55;
      edad_max = 65;
    } else if (rangoEdad === "6") {
      edad_min = 65;
      edad_max = 999;
    }

    // Ajuste de precio_min y precio_max según los valores proporcionados
    let precio_min =
      values.precio.min !== "" ? parseInt(values.precio.min) : null;
    let precio_max =
      values.precio.max !== "" ? parseInt(values.precio.max) : null;

    getAmiwitos({
      pagina: pagina,
      limite: 24,
      token: token,
      filtros: {
        precio_min: precio_min,
        precio_max: precio_max,
        edad_min: edad_min,
        edad_max: edad_max,
        generos: generosLetra,
        interes: values.interecitos,
        ubicacion: values.ubicacion === "Cualquiera" ? "" : values.ubicacion,
      },
    });
  }

  const onBlurcito = (e, field) => {
    let value = e.target.value;
    console.log(`el usario dejo el ${field}: ${value}`);
    // Reemplaza todo lo que no sea un número
    value = value.replace(/[^\d]/g, "");

    value = parseInt(value);

    // Si no es un número válido, asigna una cadena vacía
    if (isNaN(value)) {
      value = "";
    } else {
      const minimooooo = parseInt(values.precio.min);
      // Validar el valor máximo
      if (field === "max" && !isNaN(minimooooo) && value <= minimooooo) {
        value = minimooooo + 5;
      }
    }

    setValues({
      ...values,
      precio: {
        ...values.precio,
        [field]: value.toString(),
      },
    });
  };

  const [intereses, setIntereses] = useState([
    { nombre: "Arte y Cultura", seleccionado: false },
    { nombre: "Cine y Series", seleccionado: false },
    { nombre: "Gastronomía", seleccionado: false },
    { nombre: "Idiomas", seleccionado: false },
    { nombre: "Lectura", seleccionado: false },
    { nombre: "Taekwondo", seleccionado: false },
    { nombre: "Tecnología", seleccionado: false },
  ]);

  const ubicacionesPermitidas = [
    "Cualquiera",
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
    setValues({
      ...values,
      generosos: nuevosGeneros
        .filter((generitooo) => {
          return generitooo.estado;
        })
        .map((generitooo12) => {
          return generitooo12.nombre;
        }),
    });
    SetGeneros(nuevosGeneros);
  }

  useEffect(() => {
    // Ordenar intereses seleccionados alfabéticamente
    setIntereses(intereses.sort((a, b) => a.nombre.localeCompare(b.nombre)));
  }, [intereses]);

  const dropdownRef = useRef(null);
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        // Click fuera del dropdown, cerrar
        SetGeneroDropCheckBox(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  useEffect(() => {
    setValues({
      ...values,
      interecitos: intereses
        .filter((int) => {
          return int.seleccionado;
        })
        .map((int) => {
          return int.nombre;
        }),
    });
  }, [intereses]);

  return (
    <div id="lista_amigos" className="page bg-light" ref={pageRef}>
      <div className="filtrosYBoton d-flex justify-content-center">
        <div className="rectangle">
          <div>
            <label htmlFor="intereses" className="input-label">
              <MdInterests />
              Intereses
            </label>
            <select
              id="intereses"
              name="intereses"
              onChange={(e) => {
                const selectedInterest = e.target.value;
                setIntereses(
                  intereses.map((interes) => {
                    if (interes.nombre === selectedInterest) {
                      return {
                        ...interes,
                        seleccionado: interes.nombre === selectedInterest,
                      };
                    }
                    return interes;
                  })
                );
              }}
              className="form-select"
            >
              <option className="nomostraropcionxd"> </option>
              {intereses.map((interes) => {
                if (!interes.seleccionado) {
                  return (
                    <option key={interes.nombre} value={interes.nombre}>
                      {interes.nombre}
                    </option>
                  );
                }
              })}
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
              style={{ boxShadow: "none", border: "1px solid #ced4da" }}
            >
              <option value="0">Cualquiera</option>
              <option value="1">Entre 18 y 25 años</option>
              <option value="2">Entre 25 y 35 años</option>
              <option value="3">Entre 35 y 45 años</option>
              <option value="4">Entre 45 y 55 años</option>
              <option value="5">Entre 55 y 65 años</option>
              <option value="6">Más de 65 años</option>
            </select>
          </div>

          <div>
            <label htmlFor="precio" className="input-label input-item">
              <MdOutlineAttachMoney />
              Precio
            </label>
            <div className="precio-container">
              <div className="precios">
                <input
                  type="text"
                  placeholder="Min"
                  className="form-control"
                  style={{ boxShadow: "none", border: "1px solid #ced4da" }}
                  value={values.precio.min}
                  onBlur={(e) => onBlurcito(e, "min")}
                  onChange={(e) => {
                    if (validNumberPattern.test(e.target.value)) {
                      setValues({
                        ...values,
                        precio: { ...values.precio, min: e.target.value },
                      });
                    }
                  }}
                  onKeyDown={handleKeyDown}
                />
                <p>-</p>
                <input
                  type="text"
                  placeholder="Max"
                  className="form-control"
                  style={{
                    marginLeft: "0",
                    boxShadow: "none",
                    border: "1px solid #ced4da",
                  }}
                  value={values.precio.max}
                  onBlur={(e) => {
                    console.log("holalalsadas");
                    onBlurcito(e, "max");
                  }}
                  onChange={(e) => {
                    if (validNumberPattern.test(e.target.value)) {
                      setValues({
                        ...values,
                        precio: { ...values.precio, max: e.target.value },
                      });
                    }
                  }}
                  onKeyDown={handleKeyDown}
                />
              </div>
            </div>
          </div>

          <div>
            <label className="input-label input-item">
              <IoPeople />
              Género
            </label>
            <div className="generoDropCheckBox" ref={dropdownRef}>
              <p onClick={() => SetGeneroDropCheckBox(!generoDropCheckBox)}>
                Seleccionar <FaAngleDown />
              </p>
              {generoDropCheckBox && (
                <div className="itemsGenero">
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
              style={{ boxShadow: "none", border: "1px solid #ced4da" }}
            >
              <option value=""></option>
              {ubicacionesPermitidas.map((ubicacion) => (
                <option key={ubicacion} value={ubicacion}>
                  {ubicacion}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="btn-container" style={{ marginLeft: "10px" }}>
          <button className="btn btn-azul" onClick={ActualizarListaAmigos}>
            <FaFilter style={{ color: "white" }} /> Filtrar
          </button>
        </div>
      </div>
      <div className="interesesSeleccionados">
        {intereses.map((interes) => {
          if (interes.seleccionado) {
            return (
              <div className="burbujaInteres">
                {interes.nombre}
                <IoClose
                  className="cerrarBurbuja"
                  onClick={() =>
                    setIntereses(
                      intereses.map((i) => {
                        if (i.nombre === interes.nombre) {
                          return { ...i, seleccionado: !i.seleccionado };
                        }
                        return i;
                      })
                    )
                  }
                />
              </div>
            );
          }
        })}
      </div>
      {isLoading ? (
        <Loading />
      ) : (
        isSuccess && (
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
            {Number(pagina) === amigos.numero_paginas && (
              <p id="mensaje-no-more-results">No existen más resultados</p>
            )}
            <nav aria-label="Page navigation example">
              <ul className="pagination justify-content-center">
                <li className="page-item">
                  <Link
                    className={`page-link ${
                      Number(pagina) === 1 && "disabled"
                    }`}
                    to={`/amigos?pagina=${
                      Number(pagina) > 1 ? Number(pagina) - 1 : Number(pagina)
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
                      Number(pagina) === index + 1 && "active"
                    }`}
                  >
                    <Link
                      className={`page-link ${
                        Number(pagina) === index + 1 && "bg-azul-fuerte"
                      }`}
                      to={`/amigos?pagina=${index + 1}`}
                      onClick={goToBeginning}
                    >
                      {index + 1}
                    </Link>
                  </li>
                ))}
                <li className="page-item">
                  <Link
                    className={`page-link ${
                      Number(pagina) === amigos.numero_paginas && "disabled"
                    }`}
                    onClick={() => goToBeginning}
                    to={`/amigos?pagina=${
                      Number(pagina) < amigos.numero_paginas
                        ? Number(pagina) + 1
                        : Number(pagina)
                    }`}
                  >
                    {">"}
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        )
      )}
    </div>
  );
};

export default ListaAmigos;
