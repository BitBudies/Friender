import React from 'react';
import { useParams } from 'react-router-dom';
import { getMockFriendById } from '../../hooks/mockFriend';

const PerfilAmigo = () => {
  const { id_amigo } = useParams();
  const amigo = getMockFriendById(id_amigo);

  return (
    <div className='container'>
      <div className='row'>
        <div className='col-md-6'>
          <div className='perfil-amigo-left text-center'>
            <img src={amigo.imagen} alt={amigo.nombre} className='img-fluid mb-3' style={{ width: '300px', height: '300px' }} /> 
            <h3>{amigo.nombre}</h3>
            <div>★★★☆☆</div> 
            <p><strong>Edad:</strong> {amigo.edad} años</p>
            {/* Agrega los rectángulos de 3 columnas y 2 filas aquí */}
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
      </div>
    </div>
  );
};

export default PerfilAmigo;
