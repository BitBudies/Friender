import React from 'react';
import { getMockFriends } from '../../hooks/mockFriend';
import { Link } from 'react-router-dom';
import './listaAmigos.css';

const ListaAmigos = () => {
    // Función para obtener amigos
    const amigos = getMockFriends();

    return (
        <div className='lista-amigos-container'>
            <div className='container'>
                <div className='row row-cols-1 row-cols-md-3 g-4'>
                    {amigos.map((amigo, index) => (
                        <div key={index} className='col'>
                            <div className='card'>
                                <img src={amigo.imagen} className='card-img-top' alt={amigo.nombre} />
                                <div className='card-body'>
                                    <h5 className='card-title'>{amigo.nombre}</h5>
                                    <p className='card-text'>{amigo.personasAtendidas} personas</p>
                                    <Link to={`/amigos/${amigo.id}`} className='btn btn-primary'>
                                        Ver Perfil
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ListaAmigos;
