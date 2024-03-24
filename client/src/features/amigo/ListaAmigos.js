import React, { useEffect } from 'react';
import { getMockFriends } from '../../hooks/mockFriend';
import { Link } from 'react-router-dom';
import './listaAmigos.css';

const ListaAmigos = () => {
    const amigos = getMockFriends();

    useEffect(() => {
        console.log(amigos);
    }, [amigos]);

    return (
        <div id='lista_amigos' className='page'>
            <div className='container'>
                <div className='row row-cols-0 row-cols-lg-4 row-cols-md-3 g-3'>
                    {amigos.map((amigo, index) => (
                        <div key={index} className='col'>
                            <div className='card'>
                                <div className='card-header' style={{ backgroundImage: `url(${amigo.imagen})` }}></div>
                                <div className='card-body'>
                                    <h5 className='card-title'>{amigo.nombre}</h5>
                                    <div className='card-text'>
                                        <div className="card-stats">
                                            <div>★★★☆☆</div> 
                                            <div>{amigo.n_clientes} personas</div>
                                        </div>
                                        <div className="card-actions">
                                            <Link to={`/amigos/${amigo.id}`} className='btn btn-primary'>Ver Perfil</Link>
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
    );
}

export default ListaAmigos;
