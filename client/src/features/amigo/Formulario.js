import React, { useEffect } from 'react'
import "./Formulario.css"

const Formulario = ({nombre,precio}) => {
  useEffect(() => {
    console.log(nombre,precio);

    //1. Habilitar/Deshabilitar visualización del formulario de la solicitud de encuentro
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

    //Validar Fecha y Hora
    //const formularioSolicitud = document.getElementById('formularioSolicitud');
    const botonEnviar = document.getElementById('botonEnviar');
    const fechaInput = document.getElementById('fecha');
    const horaInput = document.getElementById('hora');

    //2. Verificar campos llenados
    const validarFormulario = () => {
      const fecha = document.getElementById('fecha').value;
      const hora = document.getElementById('hora').value;
      const duracion = document.getElementById('duracion').value;
      const direccion = document.getElementById('direccion').value;
      const descripcion = document.getElementById('descripcion').value;
    
      if (!fecha || !hora || !descripcion || !direccion || !duracion) {
        alert('Los campos marcados con * son obligatorios');
        return false;
      }

      return true;
    };
    
    //3. Validar fecha y hora para enviar solicitud
    botonEnviar.addEventListener('click', (event) => {
      event.preventDefault();

      if(validarFormulario()){
        // Obtener fecha y hora actual
        const hoy = new Date();
        const fechaActual = hoy.getFullYear() + '-' + (hoy.getMonth() + 1).toString().padStart(2, '0') + '-' + hoy.getDate().toString().padStart(2, '0');
        const horaActual = hoy.getHours() + ':' + hoy.getMinutes().toString().padStart(2, '0');

        // Si la validación es exitosa, enviar el formulario
        if(fechaInput.value > fechaActual){
          alert('El formulario fue enviado con éxito');
          //formularioSolicitud.submit();
        }
      
        // Validar fecha
        if (fechaInput.value < fechaActual) {
          alert('Ingrese una FECHA mayor a la actual');
        }

        // Validar hora (si la fecha es la actual)
        if (fechaInput.value === fechaActual) {
          if (horaInput.value <= horaActual) {
            alert('Ingrese una HORA mayor a la actual');
          }
        }
      }
      });

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
          <button id="botonEnviar" type="button">Enviar Solicitud</button>
        </div>

        <img id="icono-cerrar" src="https://cdn.icon-icons.com/icons2/1207/PNG/512/1491313938-close_82982.png" alt="iconoCerrar"/>
      </div>
    </div>
  )
}

export default Formulario