import React from 'react';
import { useParams } from 'react-router-dom';
import { getMockFriendById } from '../../hooks/mockFriend';
import './PerfilAmigo.css'; // Importa tu archivo CSS aquí

const PerfilAmigo = () => {
  const { id_amigo } = useParams();
  const amigo = getMockFriendById(id_amigo);

  return (
    <div className='perfil-amigo-container'>
      <div className='perfil-amigo-left'>
        <img src={amigo.foto} alt={amigo.nombre} />
        <h3>{amigo.nombre}</h3>
        {/* Agrega las estrellas aquí */}
        <p>Edad: {amigo.edad} años</p>
        {/* Agrega los rectángulos de 3 columnas y 2 filas aquí */}
      </div>
      <div className='perfil-amigo-right'>
        <h2>Perfil de Amigo</h2>
        <p>Intereses: {amigo.intereses}</p>
        <p>Gustos: {amigo.gustos}</p>
        <p>Descripción: {amigo.descripcion}</p>
        <div className='cuadro-vacio'></div>
        <p>Precio: {amigo.precio}</p>
        <button className='solicitar-contacto-btn'>Solicitar Contacto</button>
      </div>
    </div>
  );
};

export default PerfilAmigo;
