import React from 'react';
import { Link } from 'react-router-dom';
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
    const {data:amigos, isFetching, isSuccess} = useGetAmigosQuery({
        pagina: 1,
        limite: 40
    });

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
                                <div className='card card-list'>
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
                </div>
            </div>
        );
    }   
}

export default ListaAmigos;
