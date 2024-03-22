import React, { useEffect, useState } from 'react'
import { getMockFriends } from '../../hooks/getMockFriends'

import "./listaAmigos.css"

const ListaAmigos = () => {

    //funcion para obtener amigos
    const amigos = getMockFriends(10);

  return (
    <div id='lista_amigos' className='container'>
      {amigos.map((amigo) => {
        return(
            <div key={amigo.id} className='card'>
                <div className='card_header' style={{backgroundImage : `url(${amigo.image})`}}></div>
                <h4>{amigo.nombre}</h4>
            </div>
        );
      })}
    </div> 
  )
}

export default ListaAmigos
