import React, { useEffect, useState, useRef } from "react";
import { Link, useParams, useLocation, useNavigate } from "react-router-dom";
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
  const [consultar, setConsultar] = useState(false)
  const navigateTo = useNavigate();
  const [cookies] = useCookies(["token"]);
  const token = cookies.token;
  const validNumberPattern = /^[0-9+-]*$/;
  const interesPermitidos = [
    "Arte y Cultura",
    "Cine y Series",
    "Gastronomía",
    "Idiomas",
    "Lectura",
    "Taekwondo",
    "Tecnología",
  ];
  const generosPermitidos = [
    "Masculino",
    "Femenino",
    "Otro"
  ];
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
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const pagina = queryParams.get("pagina") || 1;
  const edadP = queryParams.get("edad") || "0";
  const generosP = (queryParams.getAll("genero") || []).filter(genero => generosPermitidos.includes(genero));

  const interesesP = (queryParams.getAll("interes") || []).filter(interes => interesPermitidos.includes(interes))

  const precio_minP = queryParams.get("precio_min") || "";
  const precio_maxP = queryParams.get("precio_max") || "";
  const ubicacionP = queryParams.get("ubicacion") || "Cualquiera";

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
    interecitos: interesPermitidos.map((nombreInteres) => {
      return {
        nombre: nombreInteres,
        seleccionado: interesesP.includes(nombreInteres),
      };
    }),
    rangoEdad: edadP,
    precio: {
      min: isNaN(precioMinimo) ? "" : precioMinimo.toString(),
      max: isNaN(precioMaximo) ? "" : precioMaximo.toString(),
    },
    generosos: generosPermitidos.map((nombreGenero) => {
      return {
        nombre: nombreGenero,
        estado: generosP.includes(nombreGenero)
      };
    }),
    ubicacion: ubicacionP,
  });

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.target.blur();
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

  const [getAmiwitos, { data: amigos, isLoading, isSuccess, isError, error }] =
    useGetAmigosMutation();

  useEffect(() => {
    setConsultar(false)
    const edadRanges = {
      "0": { min: null, max: null },
      "1": { min: 18, max: 25 },
      "2": { min: 25, max: 35 },
      "3": { min: 35, max: 45 },
      "4": { min: 45, max: 55 },
      "5": { min: 55, max: 65 },
      "6": { min: 65, max: 999 },
    };
    const rangoEdad = values.rangoEdad;
    const { min: edad_min, max: edad_max } = edadRanges[rangoEdad];

    getAmiwitos({
      token: token,
      filtros: {
        pagina: pagina,
        limite: 8,
        precio_min:
          values.precio.min == "" ? null : parseInt(values.precio.min),
        precio_max:
          values.precio.max == "" ? null : parseInt(values.precio.max),
        edad_min: edad_min,
        edad_max: edad_max,
        generos: values.generosos.filter((genero) => genero.estado).map((genero) => genero.nombre.charAt(0).toUpperCase()),
        interes: values.interecitos.filter((interes) => interes.seleccionado).map((interes) => interes.nombre),
        ubicacion: values.ubicacion === "Cualquiera" ? "" : values.ubicacion,
      },
    });
  }, [consultar, location]);

  function ActualizarListaAmigos() {
    console.log(values);
    let precio_min =
      values.precio.min !== "" ? parseInt(values.precio.min) : null;
    let precio_max =
      values.precio.max !== "" ? parseInt(values.precio.max) : null;
    const generosMandar = values.generosos
      .filter((genero) => genero.estado).map((genero) => {
        return `genero=${genero.nombre}`;
      })
      .join("&");
    const intereseMandar = values.interecitos
      .filter((interes) => interes.seleccionado)
      .map((interes) => `interes=${interes.nombre}`)
      .join("&");
      navigateTo(
        `/amigos?pagina=${pagina}${
          generosMandar.length > 0 ? "&" + generosMandar : ""
        }${intereseMandar.length > 0 ? "&" + intereseMandar : ""}${
          values.ubicacion === "Cualquiera" ? "" : `&ubicacion=${values.ubicacion}`
        }${values.rangoEdad === "0" ? "" : `&edad=${values.rangoEdad}`}${
          precio_min !== null ? `&precio_min=${precio_min}` : ""
        }${precio_max !== null ? `&precio_max=${precio_max}` : ""}`
      );
    setConsultar(true)
  }

  useEffect(() => {
    // Mantener los filtros previamente seleccionados al cambiar de página
    const queryParams = new URLSearchParams(location.search);
    const edadP = queryParams.get("edad") || "0";
    const generosP = (queryParams.getAll("genero") || []).filter((genero) =>
      generosPermitidos.includes(genero)
    );
    const interesesP = (queryParams.getAll("interes") || []).filter((interes) =>
      interesPermitidos.includes(interes)
    );
    const precio_minP = queryParams.get("precio_min") || "";
    const precio_maxP = queryParams.get("precio_max") || "";
    const ubicacionP = queryParams.get("ubicacion") || "Cualquiera";

    let precioMinimo = parseInt(precio_minP);
    let precioMaximo = parseInt(precio_maxP);
    if (!isNaN(precioMinimo)) {
      if (precioMinimo < 0 || precioMinimo > 999999) {
        precioMinimo = NaN;
      }
    }
    if (!isNaN(precioMaximo)) {
      if (precioMaximo < 0 || precioMaximo > 999999) {
        precioMaximo = NaN;
      }
    }

    setValues({
      ...values,
      interecitos: interesPermitidos.map((nombreInteres) => {
        return {
          nombre: nombreInteres,
          seleccionado: interesesP.includes(nombreInteres),
        };
      }),
      rangoEdad: edadP,
      precio: {
        min: isNaN(precioMinimo) ? "" : precioMinimo.toString(),
        max: isNaN(precioMaximo) ? "" : precioMaximo.toString(),
      },
      generosos: generosPermitidos.map((nombreGenero) => {
        return {
          nombre: nombreGenero,
          estado: generosP.includes(nombreGenero),
        };
      }),
      ubicacion: ubicacionP,
    });
  }, [location]);

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

  const [generoDropCheckBox, SetGeneroDropCheckBox] = useState(false);

  function handleGeneroChange(nuevoGenero) {
    setValues({
      ...values,
      generosos: values.generosos
        .map((genero) => {
          if (genero.nombre === nuevoGenero.nombre) {
            return { nombre: genero.nombre, estado: !genero.estado };
          }
          return genero
        }),
    });
  }

  useEffect(() => {
    setValues({
      ...values,
      interecitos: values.interecitos.sort((a, b) =>
        a.nombre.localeCompare(b.nombre)
      ),
    });
  }, [values.interecitos]);

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
                setValues({
                  ...values,
                  interecitos: values.interecitos.map((interes) => {
                    if (interes.nombre == selectedInterest) {
                      return {
                        nombre: interes.nombre,
                        seleccionado: true,
                      };
                    }
                    return interes;
                  }),
                });
              }}
              className="form-select"
            >
              <option className="nomostraropcionxd"> </option>
              {values.interecitos.map((interes) => {
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
                  placeholder="Máx"
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
                  {values.generosos.map((genero) => {
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
        {values.interecitos.map((interes) => {
          if (interes.seleccionado) {
            return (
              <div className="burbujaInteres">
                {interes.nombre}
                <IoClose
                  className="cerrarBurbuja"
                  onClick={() =>
                    setValues({
                      ...values,
                      interecitos: values.interecitos.map((interesUwu) => {
                        if (interesUwu.nombre === interes.nombre) {
                          return {
                            nombre: interesUwu.nombre,
                            seleccionado: false,
                          };
                        }
                        return interesUwu;
                      }),
                    })
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
        isSuccess ? (
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
                  <button
                    className={`page-link ${
                      Number(pagina) === amigos.numero_paginas && "disabled"
                    }`}
                    onClick={() => {
                      const nextPage = Number(pagina) + 1;
                      const queryParams = new URLSearchParams(location.search);
                      queryParams.set("pagina", nextPage);
               
                      navigateTo(`/amigos?${queryParams.toString()}`);
                      goToBeginning();
                    }}
                  >
                    {">"}
                  </button>
                </li>

              </ul>
            </nav>
          </div>
        ) : ( isError && (
          <div className="mostrarErrorListaAmigos">{error.data.error}</div>
        )
        )
      )}
    </div>
  );
};

export default ListaAmigos;
