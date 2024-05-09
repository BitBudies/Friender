import React, {useState, useEffect} from 'react'
import Foto from '../imagRegistro/test';
import Preview from '../imagRegistro/preview';
import { useCookies } from "react-cookie";
import { useGetClienteByIdQuery } from '../NavBarSlice';
import { useGlobalContext } from '../../context';
import Loading from '../Loading';

const MiPerfil = () => {
    const [cookies] = useCookies(["token"]);
    const token = cookies.token;
    const [foto, setFoto] = useState(""); //para la preview
    const {userData} = useGlobalContext();

    const {
        data: cliente,
        isFetching,
        isSuccess,
      } = useGetClienteByIdQuery({ id_cliente: userData.cliente_id, token: token });
    
    if (isSuccess){
        console.log(cliente)
    }
    
    const calificacionEstrellas = (calificacion) => {
        const numEstrellas = Math.round(calificacion);
        const estrellas = "★".repeat(numEstrellas) + "☆".repeat(5 - numEstrellas);
        return estrellas;
    };
  if (isFetching){
    return <Loading />
  } else if (isSuccess){
    return (
        // <div className="page">
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
            <h1>Mi Perfil</h1>
            <div className="profile-description w-100">
              <p>
                <strong>Descripción:</strong> {cliente.descripcion}
              </p>
            </div>
          </div>
        </div>
    //   </div>    
    );
  }
}
export default MiPerfil