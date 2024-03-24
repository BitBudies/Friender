import React, { useEffect } from 'react'
import { getMockFriends } from '../../hooks/mockFriend'
import { Link } from 'react-router-dom'

import "./listaAmigos.css"

const ListaAmigos = () => {

    //funcion para obtener amigos
    const amigos = getMockFriends();

    useEffect(() => {
        console.log(amigos);
      },[amigos])

  return (
    <div id='lista_amigos' className='page'>
    <div className='container-fluid'>
        {/*row row-cols-0 row-cols-lg-4 row-cols-md-3 g-3*/ }
      <div className='row row-cols-0 row-cols-lg-4 row-cols-md-3 g-3 my-4'>
      {amigos.map((amigo, index) => (
            <div key={index} className=' col'>
                <div className='card'>
                <div className='card_header' style={{backgroundImage : `url(${amigo.imagen})`}}></div>
                <div className='card_content'>                               
                     {/* Información del amigo */}
                        <div className='card_info'>
                            {/* Nombre del amigo */}
                            <h4>{amigo.nombre}</h4>                        
                            {/* Estrellas y número de personas atendidas */}
                            <div className="card_stats">
                                <div>★★★☆☆</div> {/* Ejemplo de estrellas */}
                                    <div>{amigo.n_clientes} personas</div>
                            </div>
                            {/* Precio y botón de Ver Perfil */}
                            <div className="card_actions">
                                <Link to={`/amigos/${amigo.id}`}className='btn btn-azul'>Ver Perfil</Link>
                                <div>{amigo.precio} BOB</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        ))}                    
        </div>
        </div>
    </div> 
  )
}

export default ListaAmigos
