import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useGetAmigoByIdQuery } from './amigoSlice';
import Loading from '../../Components/Loading';
import "./PerfilAmigo.css";
import Formulario from './Formulario';

const PerfilAmigo = () => {
  const { id_amigo } = useParams();
  const { data: amigo, isFetching, isSuccess } = useGetAmigoByIdQuery(id_amigo);

  useEffect(() => {
    console.log(amigo, isFetching, isSuccess);
  }, [amigo, isFetching, isSuccess]);

  if (isFetching) {
    return <Loading />;
  } else if (isSuccess) {
    return (
      <div className='container perfil-amigo-scrollable'>
        <div className='row perfil-amigo-container'>
          <div className='col-md-6 perfil-amigo-left'>
          <div className='image-container'style={{ backgroundImage: `url(/images/${
                                        amigo.genero === 'M' ? "guy.png":
                                        amigo.genero === 'F' ? "girl.png" : "otros.png"
                                     })` }}/>
            <center></center><h3>{amigo.nombre}</h3>
            <div>★★★☆☆</div>
            <p><strong>Edad:</strong> {amigo.fecha_nacimiento} años</p>
          </div>
          <div className='col-md-6 perfil-amigo-right'>
            <div className='p-4'>
              <h2>Perfil de Amigo</h2>
              <p><pre><strong>Descripción:</strong> {amigo.descripcion}</pre></p>
              <p><h2><strong>Precio:</strong> {amigo.precio_amigo}</h2></p>
              <button className='btn btn-primary mt-3'>Solicitar Contacto</button>
            </div>
          </div>
        </div>
        <Formulario nombre={amigo.nombre} precio={amigo.precio_amigo} />
      </div>
    );
  }
};

export default PerfilAmigo;
