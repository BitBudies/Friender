import React, {useState} from 'react'
import Foto from '../imagRegistro/test';
import Preview from '../imagRegistro/preview';
import { useCookies } from "react-cookie";
import { useGetAmiwoPrecioQuery, useGetClienteByIdQuery } from '../NavBarSlice';
import { useGlobalContext } from '../../context';
import Loading from '../Loading';
import Etiqueta from './Etiqueta';

import './MiPerfil.css'

const MiPerfil = () => {
    const [cookies] = useCookies(["token"]);
    const token = cookies.token;
    const [foto, setFoto] = useState(""); //para la preview
    const {userData, isFriendModeEnabled, friendPrice } = useGlobalContext();
    const {
        data: cliente,
        isFetching,
        isSuccess,
      } = useGetClienteByIdQuery({ id_cliente: userData.cliente_id, token: token });
    
    const {
        data: info, 
        isFetching: cargandin, 
        isSuccess: suceso} = useGetAmiwoPrecioQuery(token);

    
    if (suceso){
        console.log("precio es: " + info.precio)
    }
    
    const calificacionEstrellas = (calificacion) => {
        const numEstrellas = Math.round(calificacion);
        const estrellas = "★".repeat(numEstrellas) + "☆".repeat(5 - numEstrellas);
        return estrellas;
    };
  if (isFetching || cargandin){
    return <Loading />
  } else if (isSuccess){
    return (
        // <div className="page">
        <div className="miperfil-amigo-container">
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
            <div className='mi-perfil-centro'>
              <h1>Mi Perfil</h1>
            </div>
            
            <p>
                <strong>Mis Intereses</strong>
              </p>
            <div className='para-intereses'>
              
              {
                cliente.interes.map((interes) =>{
                    return <Etiqueta interes={interes}/>
                })
              }
            </div>
            <div className="profile-description w-100">
              <p>
                <strong>Descripción:</strong> 
              </p>
              <p>
                {cliente.descripcion}
              </p>
            </div>
            <div>
                {
                    isFriendModeEnabled && //falta aumentar si esta en modo amigo o cliente
                    <h3><strong>Precio:</strong> {friendPrice} Bs/hr</h3> 
                }
            </div>
          </div>
        </div>
    //   </div>    
    );
  }
}
export default MiPerfil