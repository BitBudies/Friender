import React from 'react'
import { getMockFriends } from '../../hooks/mockFriend'
import { Link } from 'react-router-dom'

import "./listaAmigos.css"

const ListaAmigos = () => {

    //funcion para obtener amigos
    const amigos = getMockFriends();

  return (
    <div id='lista_amigos' className='container'>
      {amigos.map((amigo) => {
        return(
            <div key={amigo.id} className='card'>
                <div className='card_header' style={{backgroundImage : `url(${amigo.imagen})`}}></div>
                <h4>{amigo.nombre}</h4>
                <Link to={`/amigos/${amigo.id}`}className='btn btn-azul'>Ver Perfil</Link>
            </div>
        );
      })}
    </div> 
  )
}

export default ListaAmigos
