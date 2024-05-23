import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useGetAmigoByIdQuery } from "./amigoSlice";
import Loading from "../../Components/Loading";
import "./PerfilAmigo.css";
import Formulario from "../solicitudes/Formulario";
import { useCookies } from "react-cookie";
import Foto from "../../Components/imagRegistro/test";
import Preview from "../../Components/imagRegistro/preview";

const PerfilAmigo = () => {
  const [cookies] = useCookies(["token"]);
  const token = cookies.token;
  const [foto, setFoto] = useState(""); //para la preview

  const { id_amigo } = useParams();
  const {
    data: amigo,
    isFetching,
    isSuccess,
  } = useGetAmigoByIdQuery({ id_amigo: id_amigo, token: token });
  const [showForm, setShowForm] = useState(false);
  const [formStatus, setFormStatus] = useState({
    sent: false,
    message: "",
    show: false,
  });
  const calificacionEstrellas = (calificacion) => {
    const numEstrellas = Math.round(calificacion);
    const estrellas = "★".repeat(numEstrellas) + "☆".repeat(5 - numEstrellas);
    return estrellas;
  };

  useEffect(() => {
    console.log(amigo, isFetching, isSuccess);
  }, [amigo, isFetching, isSuccess]);

  if (isFetching) {
    return <Loading />;
  } else if (isSuccess) {
    return (
      <div className="page">
        <div className="perfil-amigo-container">
          <div className=" perfil-amigo-left ">
            <div
              className="image-container"
              style={{
                backgroundImage: `url(${
                  amigo.imagenes && amigo.imagenes[0]
                    ? "data:image/jpeg;base64," + amigo.imagenes[0].imagenBase64
                    : "/images/user.jpeg"
                })`,
              }}
            />
            <div className="stars-and-name" style={{ fontSize: "35px" }}>
              <div className="text-warning">
                {calificacionEstrellas(amigo.calificacion)}
              </div>
              <h3>{amigo.nombre_completo}</h3>
            </div>
            <p>
              <strong>Edad:</strong> {amigo.edad} años
            </p>

            <div className="galeria">
              {amigo.imagenes.map((imagen) => {
                console.log(imagen);
                return (
                  <Foto
                    foto={"data:image/jpeg;base64," + imagen.imagenBase64}
                    setPreview={setFoto}
                    conX={false}
                  />
                );
              })}
            </div>
            <Preview
              foto={foto}
              handleClose={() => {
                setFoto("");
              }}
            />
          </div>

          <div className="perfil-amigo-right">
            <h1>Perfil de amigo</h1>
            <div className="profile-description w-100">
              <p>
                <strong>Descripción:</strong> {amigo.descripcion}
              </p>
            </div>

            <p>
              <h4>
                <strong>Precio:</strong> {amigo.precio_amigo} Bs/hr
              </h4>
            </p>
            {formStatus.sent ? (
              <div
                class={`profile-alert ${
                  !formStatus.show && "hide"
                } alert alert-success`}
                role="alert"
              >
                <strong>{formStatus.message}</strong>
              </div>
            ) : (
              <div className="btn-container">
                <button
                  className="btn btn-azul mt-3 btn-solicitar"
                  onClick={() => setShowForm(true)}
                >
                  Solicitar Cita
                </button>
              </div>
            )}
          </div>
        </div>
        <Formulario
          amigo_id={id_amigo}
          precio={amigo.precio_amigo}
          showForm={showForm}
          setShowForm={setShowForm}
          formStatus={formStatus}
          setFormStatus={setFormStatus}
        />
      </div>
    );
  }
};

export default PerfilAmigo;
