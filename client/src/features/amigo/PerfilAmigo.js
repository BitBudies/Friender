import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useGetAmigoByIdQuery } from './amigoSlice';
import Loading from '../../Components/Loading';
import "./PerfilAmigo.css";
import Formulario from '../solicitudes/Formulario';

const PerfilAmigo = () => {
  const { id_amigo } = useParams();
  const { data: amigo, isFetching, isSuccess } = useGetAmigoByIdQuery(id_amigo);
  const [showForm,setShowForm] = useState(false)
  const [formStatus,setFormStatus] = useState({sent : false, message: '',show: false})

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
          <div className='image-container' style={{ backgroundImage: `url(/images/user.jpeg)` }} />
  <div className='stars-and-name' style={{ fontSize: '35px' }}>
  <center><div>★★★☆☆</div></center>
    <center><h3>{amigo.nombre_completo}</h3></center>
  </div>
  <p><strong>Edad:</strong> {amigo.edad} años</p>
  
</div>
<div className='col-md-6 col-sm-12 perfil-amigo-right d-flex justify-content-center align-items-center'>
  <div className='p-4 w-55'> {/* Modificamos el ancho de la parte derecha */}
    <center><h2>Perfil de Amigo</h2></center>
    <br /><br /><br /><br /><br />
    <div className='profile-description w-100'>
      <p><strong>Descripción:</strong> {amigo.descripcion}</p>
    </div>
    
    <p><h2><strong>Precio:</strong> {amigo.precio_amigo}Bs/hr</h2></p>
    {formStatus.sent ? 
      <div class={`profile-alert ${!formStatus.show && "hide"} alert alert-success`} role="alert">
        <strong>{formStatus.message}</strong> 
        
      </div> :
      <div className='btn-container'>
        <br /><br /><br /><br /><br />
        <button className='btn btn-azul mt-3 btn-solicitar' onClick={() => setShowForm(true)}>Solicitar Contacto</button>
      </div>
    }
  </div>
</div>

          </div>
        </div>
        <Formulario amigo_id = {id_amigo}
                    precio={amigo.precio_amigo} 
                    showForm={showForm} 
                    setShowForm={setShowForm} 
                    formStatus={formStatus}
                    setFormStatus ={setFormStatus} />
      </div>
      
    );
  }
};

export default PerfilAmigo;
