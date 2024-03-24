import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { getMockFriendById } from '../../hooks/mockFriend';

const PerfilAmigo = () => {
  const {id_amigo} = useParams();

  const amigo = getMockFriendById(id_amigo);


  return (
    <div id='perfil_amigo'>
      {amigo.nombre}
    </div>
  )
}

export default PerfilAmigo
