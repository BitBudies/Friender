import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getMockFriendById } from '../../hooks/mockFriend';
import { useGetAmigoByIdQuery } from './amigoSlice';

const PerfilAmigo = () => {
  const { id_amigo } = useParams();
  const {data:amigo,isFetching,isSuccess} = useGetAmigoByIdQuery(id_amigo)

  useEffect(() => {
    console.log(amigo,isFetching,isSuccess)
  },[amigo, isFetching, isSuccess])

  return (
    <div className='container'>
      {/* <div className='row'>
        <div className='col-md-6'>
          <div className='perfil-amigo-left text-center'>
            <div className='image'>Imagen</div> 
            <h3>{amigo.nombre}</h3>
            <div>★★★☆☆</div> 
            <p><strong>Edad:</strong> {amigo.edad} años</p>
          </div>
        </div>
        <div className='col-md-6'>
          <div className='perfil-amigo-right p-4'>
            <h2>Perfil de Amigo</h2>
            <p><strong>Intereses: </strong>{amigo.intereses}</p>
            <p><strong>Gustos:</strong> {amigo.gustos}</p>
            <p><pre><strong>Descripción:</strong> </pre>{amigo.descripcion}</p>
            <div className='cuadro-vacio'></div>
            <p><h2><strong>Precio:</strong> {amigo.precio}</h2></p>
            <button className='btn btn-primary mt-3'>Solicitar Contacto</button>
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default PerfilAmigo;
