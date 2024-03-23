import React from 'react'
import { getMockFriends } from '../../hooks/mockFriend'
import { Link } from 'react-router-dom'

import "./listaAmigos.css"

const ListaAmigos = () => {

    //funcion para obtener amigos
    const amigos = getMockFriends();

  return (
    <div id='lista_amigos' className='container'>
      <div className='grid-container'>
                    {amigos.map((amigo, index) => (
                        <div key={index} className='card'>
                            <div className='card_content'>
                               
                              <div className='card_header' style={{backgroundImage : `url(${amigo.imagen})`}}></div>
                                {/* Información del amigo */}
                                <div className='card_info'>
                                    {/* Nombre del amigo */}
                                    <h4>{amigo.nombre}</h4>
                                    
                                    {/* Estrellas y número de personas atendidas */}
                                    <div className="card_stats">
                                        <div>★★★☆☆</div> {/* Ejemplo de estrellas */}
                                        <div>{amigo.personasAtendidas} personas</div>
                                    </div>
                                    {/* Precio y botón de Ver Perfil */}
                                    <div className="card_actions">
                                    <Link to={`/amigos/${amigo.id}`}className='btn btn-azul'>Ver Perfil</Link>
                                        <div>40 BOB</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
    </div> 
  )
}

export default ListaAmigos
