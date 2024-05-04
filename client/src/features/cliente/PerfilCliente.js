import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useGetClienteByIdQuery } from "./clienteSlice";
import Loading from "../../Components/Loading";
import "../amigo/PerfilAmigo.css";
import { useCookies } from "react-cookie";
import Foto from "../../Components/imagRegistro/test";
import Preview from "../../Components/imagRegistro/preview";

const PerfilCliente = () => {
  const [cookies] = useCookies(["token"]);
  const token = cookies.token;
  const [foto, setFoto] = useState(""); //para la preview
  const { id_cliente } = useParams();

  const {
    data: cliente,
    isFetching,
    isSuccess,
  } = useGetClienteByIdQuery({ id_cliente: id_cliente, token: token });

  const calificacionEstrellas = (calificacion) => {
    const numEstrellas = Math.round(calificacion);
    const estrellas = "★".repeat(numEstrellas) + "☆".repeat(5 - numEstrellas);
    return estrellas;
  };

  useEffect(() => {
    console.log(cliente, isFetching, isSuccess);
  }, [cliente, isFetching, isSuccess]);

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
                  cliente.imagenes && cliente.imagenes[0]
                    ? "data:image/jpeg;base64," +
                      cliente.imagenes[0].imagenBase64
                    : "/images/user.jpeg"
                })`,
              }}
            />
            <div className="stars-and-name" style={{ fontSize: "35px" }}>
              <div className="text-warning">
                {calificacionEstrellas(cliente.calificacion)}
              </div>
              <h3>{cliente.nombre_completo}</h3>
            </div>
            <p>
              <strong>Edad:</strong> {cliente.edad} años
            </p>

            <div className="galeria">
              {cliente.imagenes.map((imagen) => {
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
            <h1>Perfil de cliente</h1>
            <div className="profile-description w-100">
              <p>
                <strong>Descripción:</strong> {cliente.descripcion}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default PerfilCliente;
