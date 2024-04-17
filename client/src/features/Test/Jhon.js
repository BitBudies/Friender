import React, { useState } from 'react';
import { useUploadImageMutation, useGetImageQuery } from './JhonSlice';

const Jhon = () => {
  const [clienteId, setClienteId] = useState('');
  const [tipoImagen, setTipoImagen] = useState('');
  const [prioridad, setPrioridad] = useState('');
  const [imagen, setImagen] = useState(null);

  const [send] = useUploadImageMutation();

  // Nuevo estado para almacenar el ID de la imagen a mostrar
  const [fotografiaIdToShow, setFotografiaIdToShow] = useState('');
  const { data: imageData, isLoading, error } = useGetImageQuery(fotografiaIdToShow);
  
  
  const handleMostrarClick = () => {
    if (fotografiaIdToShow.trim() !== '') {
      console.log(fotografiaIdToShow);
      console.log(imageData);
    }
  };


  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('cliente_id', clienteId);
    formData.append('tipoImagen', tipoImagen);
    formData.append('prioridad', prioridad);
    formData.append('imagen', imagen);

    try {
      await send(formData);
      //console.log(response.data); // Manejar la respuesta según tu aplicación
    } catch (error) {
      console.error(error); // Manejar el error según tu aplicación
    }
  };

  const handleImagenChange = (event) => {
    const selectedFile = event.target.files[0];
    setImagen(selectedFile);
  };

  
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Cliente ID:
          <input
            type="text"
            value={clienteId}
            onChange={(e) => setClienteId(e.target.value)}
          />
        </label>

        <label>
          Tipo de Imagen:
          <input
            type="text"
            value={tipoImagen}
            onChange={(e) => setTipoImagen(e.target.value)}
          />
        </label>

        <label>
          Prioridad:
          <input
            type="text"
            value={prioridad}
            onChange={(e) => setPrioridad(e.target.value)}
          />
        </label>

        <label>
          Imagen:
          <input
            type="file"
            onChange={handleImagenChange}
            accept="image/*"
          />
        </label>

        <button type="submit">Subir Fotografía</button>
      </form>

      {/* Input y botón para mostrar la imagen por ID */}
      <div>
        <label>
          ID de la Fotografía a Mostrar:
          <input
            type="text"
            value={fotografiaIdToShow}
            onChange={(e) => setFotografiaIdToShow(e.target.value)}
          />
        </label>
        <button onClick={handleMostrarClick}>Mostrar Imagen</button>
      </div>
      {isLoading ? (
        <div>Cargando imagen...</div>
      ) : error ? (
        <div>Error al cargar la imagen</div>
      ) : (
        <div>
        <h1>Cliente ID: {imageData.cliente_id}</h1>
        <img src={`data:image/jpeg;base64, ${imageData.imagenBase64}`} alt="Imagen" style={{ maxWidth: '400px' }}/>
        </div>
      )}
    </div>
  );
};

export default Jhon;
