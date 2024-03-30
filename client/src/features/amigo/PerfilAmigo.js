import React, { useEffect,useState } from 'react';
import { useParams } from 'react-router-dom';
import { useGetAmigoByIdQuery } from './amigoSlice';
import Loading from '../../Components/Loading';
import "./PerfilAmigo.css";
import Formulario from '../solicitudes/Formulario';

const PerfilAmigo = () => {
  const [showForm,setShowForm] = useState(false)
  const { id_amigo } = useParams();
  const { data: amigo, isFetching, isSuccess } = useGetAmigoByIdQuery(id_amigo);

  useEffect(() => {
    console.log(amigo, isFetching, isSuccess);
  }, [amigo, isFetching, isSuccess]);

  if (isFetching) {
    return <Loading />;
  } else if (isSuccess) {
    return (
      <div className='page'>
        <div className='container-fluid'>
          <div className='row perfil-amigo-container'>
            <div className='col-md-6 col-sm-12 perfil-amigo-left d-flex flex-column align-items-center g-5'>
              <div className='image-container' style={{ 
                backgroundImage: `url(/images/${
                  amigo.genero === 'M' ? "guy.png":
                  amigo.genero === 'F' ? "girl.png" : "otros.png"
                })`
              }} />
              <center><h3>{amigo.nombre_completo}</h3></center>
              <div>★★★☆☆</div>
              <p><strong>Edad:</strong> {amigo.edad} años</p>
              <div className='rectangulo'></div>
            </div>
            <div className='col-md-6 col-sm-12 perfil-amigo-right'>
              <div className='p-4'>
                <h2>Perfil de Amigo</h2>
                <div className='rectangulo'></div>
                <p><pre><strong>Descripción:</strong> {amigo.descripcion}</pre></p>
                <div className='rectangulo'></div>
                <p><h2><strong>Precio:</strong> {amigo.precio_amigo}$/hr</h2></p>
                <button className='btn btn-azul mt-3' onClick={() => setShowForm(true)}>Solicitar Contacto</button>
              </div>
            </div>
          </div>         
        </div>
        <Formulario id_amigo = {amigo.id_amigo}
                    precio={amigo.precio_amigo} 
                    showForm={showForm} 
                    setShowForm={setShowForm} 
        />
      </div>
      
    );
  }
};

export default PerfilAmigo;
