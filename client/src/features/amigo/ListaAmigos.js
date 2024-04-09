import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import './listaAmigos.css';
import { useGetAmigosQuery } from './amigoSlice';
import Loading from '../../Components/Loading';
import { FaUser } from "react-icons/fa";

const calificacionEstrellas = (calificacion) => {
    const numEstrellas = Math.round(calificacion);
    const estrellas = '★'.repeat(numEstrellas) + '☆'.repeat(5 - numEstrellas);
    return estrellas;
};

const ListaAmigos = () => {
    const {n_page} = useParams();

    const {data:amigos, isFetching, isSuccess} = useGetAmigosQuery({
        pagina: n_page,
        limite: 20
    });

    useEffect(() => {
        console.log(amigos);
    },[amigos])

    if (isFetching) {
        return (            
            <Loading/>
        )
    }else if (isSuccess){
        return (
            <div id='lista_amigos ' className='page bg-light'>
                <div className='container-fluid py-5'>
                    <div className='row row-cols-1 row-cols-lg-4 row-cols-md-3 g-3'>
                        {amigos['amigos'].map((amigo, index) => {
                            return (
                            <div key={index} className='col'>
                                <div className='card-amigo card card-list'>
                                    <div className='card-header'
                                     style={{ backgroundImage: `url(/images/${
                                        amigo.genero === 'M' ? "guy.png":
                                        amigo.genero === 'F' ? "girl.png" : "otros.png"
                                     })` }}/>
                                    <div className='card-body px-4'>
                                        <h5 className='card-title'>{amigo.nombre_completo}</h5>
                                        <div className='card-text'>
                                            <div className="card-stats">
                                                <div>{calificacionEstrellas(amigo.calificacion)}</div> 
                                                <div className='card-n-users'>
                                                    0 <span><FaUser/></span>
                                                </div>
                                            </div>
                                            <div className="card-actions">
                                            <Link to={`/amigos/${amigo.amigo_id}`}className='btn btn-azul'>Ver Perfil</Link>                     
                                                {amigo.precio_amigo} $/Hr  
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )})}
                    </div>
                    <p id="mensaje-no-more-results">No existen más resultados</p>
                </div>
                <nav aria-label="Page navigation example">
                    <ul class="pagination justify-content-center">
                        <li class="page-item disabled">
                            <Link class="page-link" > {"<"} </Link>
                        </li>
                        {Array.from({length: amigos.numero_paginas},(_,index) => {
                            return <li className='page-item' >
                                <Link className='page-link' to={`/amigos/page/${index + 1}`}>{index + 1}</Link>
                            </li>
                        })}
                        <li class="page-item">
                        <Link class="page-link" to={`/amigos/page/${n_page + 1}`} >{">"}</Link>
                        </li>
                    </ul>
                </nav>
            </div>
        );
    }   
}

export default ListaAmigos;
