import React, {  useEffect} from 'react';
import { Link, useParams } from 'react-router-dom';
import './listaAmigos.css';
import { useGetAmigosQuery } from './amigoSlice';
import Loading from '../../Components/Loading';
import { FaUser } from "react-icons/fa";
import { useGlobalContext } from '../../context';
import { useCookies } from 'react-cookie';

const calificacionEstrellas = (calificacion) => {
    const numEstrellas = Math.round(calificacion);
    const estrellas = '★'.repeat(numEstrellas) + '☆'.repeat(5 - numEstrellas);
    return estrellas;
};

const ListaAmigos = () => {
    const [cookies] = useCookies(['token']);
    const token = cookies.token;

    const {n_page} = useParams();

    const {pageRef,goToBeginning} = useGlobalContext();

    const {data:amigos, isFetching, isSuccess} = useGetAmigosQuery({
        pagina: n_page,
        limite: 24,
        token
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
            <div id='lista_amigos ' className='page bg-light' ref={pageRef}>
                <div className='container-fluid py-5'>
                    <div className='row row-cols-1 row-cols-lg-4 row-cols-md-3 g-3'>
                        {amigos['amigos'].map((amigo, index) => {
                            return (
                            <div key={index} className='col'>
                                <div className='card-amigo card card-list'>
                                    <div className='card-header'
                                        style={{ backgroundImage: `url(${amigo.imagenBase64 ? 'data:image/jpeg;base64,' + amigo.imagenBase64 : '/images/user.jpeg'})` }}
                                    />
                                     {/* <h5 className='card-title'>{amigo.cliente_id}</h5> */}
                                    <div className='card-body px-4'>
                                        <h5 className='card-title'>{amigo.nombre_completo}</h5>
                                        <div className='card-text'>
                                            <div className="card-stats">
                                                <div className='text-warning'>{calificacionEstrellas(amigo.calificacion)}</div> 
                                                <div className='card-n-users'>
                                                    0 <span><FaUser/></span>
                                                </div>
                                            </div>
                                            <div className="card-actions">
                                            <Link to={`/amigos/${amigo.amigo_id}`}className='btn btn-azul '>Ver Perfil</Link>                     
                                                {amigo.precio_amigo} Bs/hr  
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )})}
                    </div>
                </div>
                {Number(n_page) === amigos.numero_paginas &&
                    <p id="mensaje-no-more-results">No existen más resultados
                    </p>
                }
                 <nav aria-label="Page navigation example">
                    <ul className="pagination justify-content-center">
                        <li className="page-item">
                            <Link className={`page-link ${Number(n_page) === 1 && "disabled"}`} 
                            to={`/amigos/page/${Number(n_page) > 1 ? Number(n_page) - 1 : Number(n_page)}`}> {"<"} </Link>
                        </li>
                        {Array.from({length: amigos.numero_paginas},(_,index) => {
                            return <li key={index} className={`pagination-item page-item ${Number(n_page) === index + 1 && "active"}`} >
                                <Link className={`page-link ${Number(n_page) === index + 1 && "bg-azul-fuerte"}`} 
                                to={`/amigos/page/${index + 1}`}
                                onClick={goToBeginning}
                                >{index + 1}
                                
                                </Link>
                            </li>
                        })}
                        <li className="page-item">
                        <Link className={`page-link ${Number(n_page) === amigos.numero_paginas && "disabled"}`} 
                        onClick={() => goToBeginning}
                        to={`/amigos/page/${Number(n_page) < amigos.numero_paginas ? Number(n_page) + 1 : Number(n_page)}`}
                        >
                            {">"}
                        
                        </Link>
                        </li>
                    </ul>
                </nav>
            </div>
        );
    }   
}

export default ListaAmigos;
