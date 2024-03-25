import React, { useEffect } from 'react'
import "./Formulario.css"

const Formulario = ({nombre,precio}) => {
  useEffect(() => {
    console.log(nombre,precio);
    const formulario = document.getElementById('formulario');
    const iconoCerrar = document.getElementById('icono-cerrar');
    const botonSolicitarContacto = document.getElementById('botonSolicitarContacto');
  
    const cerrarFormulario = () => {
      formulario.style.display = 'none';
    };

    const abrirFormulario = () => {
      formulario.style.display = 'block';
    };
  
    iconoCerrar.addEventListener('click', cerrarFormulario);
    botonSolicitarContacto.addEventListener('click', abrirFormulario);

  },[nombre,precio])

  return (
    <div id="formulario">
      <div id="cajaFormularioEncuentro">
        <form id="formularioSolicitud" action="/enviarFormulario.js" method="post">
          <h2>Solicitud de Encuentro</h2>
          <label for="fecha">Fecha</label>
          <input type="date" id="fecha" name="fecha" placeholder="dd/mm/aa" required />

          <label for="hora">Hora</label>
          <input type="time" id="hora" name="hora" placeholder="00:00" required/>

          <label className="en-bloque" for="duracion">Duración (hrs)</label>
          <input type="number" id="duracion" name="duracion" min="1" required/>

          <label className="en-bloque" for="direccion">Dirección</label>
          <input type="text" id="direccion" name="direccion" required/>

          <label className="en-bloque" for="descripcion">Descripción</label>
          <textarea id="descripcion" name="descripcion" rows="5" cols="50" required></textarea>
        </form>

        <div id="datosPerfilSolicitud">
          <img id="fotoPerfilSolicitud" src="https://cdn-icons-png.flaticon.com/512/552/552721.png" alt="fotoperfilsolicitud"/>
          <p id="texto-nombre" >{nombre}</p>
          <div id="cajaEstrellas" class="estrellas" >★★★☆☆</div>
          <p id="texto-precio" >Total: {precio}bs</p>
          <button id="botonEnviar" type="submit" form="formularioSolicitud">Enviar Solicitud</button>
        </div>

        <img id="icono-cerrar" src="https://cdn.icon-icons.com/icons2/1207/PNG/512/1491313938-close_82982.png" alt="iconoCerrar"/>
      </div>
    </div>
  )
}

export default Formulario