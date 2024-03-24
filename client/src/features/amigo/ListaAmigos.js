<<<<<<< HEAD
import React, { useEffect } from 'react';
import { getMockFriends } from '../../hooks/mockFriend';
import { Link } from 'react-router-dom';
import './listaAmigos.css';
import { useGetAmigosQuery } from './amigoSlice';
import Loading from '../../Components/Loading';

const ListaAmigos = () => {
    const {data:amigos,isFetching,isSuccess} = useGetAmigosQuery();

    useEffect(() => {
        if(isSuccess){
            console.log(amigos[0]);
        }
    }, [amigos,isSuccess]);

    if (isFetching) {
        return (
            <div className='section'>
                <Loading/>
            </div>
        )
    }else if (isSuccess){
        return (
            <div id='lista_amigos' className='page'>
                <div className='container py-5'>
                    <div className='row row-cols-0 row-cols-lg-4 row-cols-md-3 g-3'>
                        {amigos.map((amigo, index) => {
                            return (
                            <div key={index} className='col'>
                                <div className='card'>
                                    <div className='card-header'
                                     style={{ backgroundImage: `url(/images/${
                                        amigo.genero === 'M' ? "guy.png":
                                        amigo.genero === 'F' ? "girl.png" : "otros.png"
                                     })` }}/>
                                    <div className='card-body px-4'>
                                        <h5 className='card-title'>{amigo.nombre}</h5>
                                        <div className='card-text'>
                                            <div className="card-stats">
                                                <div>★★★☆☆</div> 
                                                <div>{amigo.n_clientes} personas</div>
                                            </div>
                                            <div className="card-actions">
                                            <Link to={`/amigos/${amigo.id}`}className='btn btn-azul'>Ver Perfil</Link>
                                                <div>{amigo.precio_amigo} BOB</div>
                                            </div>
                                        </div>
                                    </div>
=======
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
>>>>>>> af07beb (Agregar scroll y booBootstrap)
                                </div>
                            </div>
                        )})}
                    </div>
                </div>
            </div>
<<<<<<< HEAD
        );
    }

    
}
=======
        </div>
    );
};
>>>>>>> af07beb (Agregar scroll y booBootstrap)

export default ListaAmigos;
