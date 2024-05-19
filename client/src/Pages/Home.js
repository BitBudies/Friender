import React from 'react';
import "./Home.css";
import { Link } from 'react-router-dom';

const Home = () => {

  return (
    <div id='home-box' className='page'>
      <section id="home-welcome-banner" className='home-section'>
        <div id="home-mybanner" style={{backgroundImage: `url(${"/images/home-banner02.png"})`}}></div>
        <div id="home-banner-text" className='text-centered'>
          <h1>¡Bienvenido a Friender!</h1>
          <p>¿Estás listo para conocer gente nueva y vivir nuevas experiencias?</p>
          <p>¡Regístrate ahora y empieza a alquilar amigos!</p>
        </div>
      </section>
      
      <section className='home-section home-section-hgtAll'>
        <div className='section-image text-centered'>
          <h2>¿Cómo Funciona?</h2>
          <div className='display-flex d-flex-centered'>
          <img className='home-img' src="/images/home-steps-friends.png"></img>
          <div className='text-lefted home-pasos-text'>
            <b>Paso 1: Regístrate </b>
            <p>Crea un perfil gratuito con tu información personal e intereses.</p>

            <b>Paso 2: Busca amigos</b>
            <p>Utiliza nuestros filtros para encontrar amigos que se ajusten a tus necesidades como: ubicación, disponibilidad, intereses, etc.</p>

            <b>Paso 3: Reserva un amigo </b>
            <p>Envía una solicitud de amistad al amigo que te interesa y espera su respuesta.</p>

            <b>Paso 4: Paga de forma segura</b>
            <p>Realiza el pago a través de nuestra plataforma segura.</p>
            
            <b>Paso 5: ¡Disfruta la compañía de un nuevo amigo! </b>
            <p>Reúnete con tu nuevo amigo y disfruta de la experiencia.</p>
          </div>
          </div>
        </div>
      </section>

      <section id="home-divider" className='home-section colored-section'>
        <div className='text-centered white-text'>
          <h1><b>¡Enciende la diversión con Friender!</b></h1>
          <p><b>Alquila amigos y crea momentos inolvidables.</b></p>
        </div>
      </section>

      <section id="home-post-its-client" className='home-section home-section-hgtAll'>
        <div className='text-centered'>
          <h2>¡Beneficios como cliente!</h2>
          <div className='display-flex'>
            <div className='home-post-it'>
              <img className='home-post-its-icon' src="/images/world-myicon.png"></img>
              <h3>Expande tu círculo social</h3>
              <p>Sal de tu zona de confort y conoce personas de diferentes orígenes y culturas.</p>
            </div>
            <div className='home-post-it'>
            <img className='home-post-its-icon' src="/images/friends-myicon.png"></img>
              <h3>Combate la soledad y el aislamiento</h3>
              <p>Conoce gente nueva y haz amigos con los que compartir tus intereses y aficiones.</p>
            </div>
            <div className='home-post-it'>
            <img className='home-post-its-icon' src="/images/explore-myicon.png"></img>
              <h3>Vive nuevas experiencias</h3>
              <p>Practica actividades nuevas, descubre nuevos lugares y diviértete con tus nuevos amigos.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="home-post-its-friend" className='home-section colored-section home-section-hgtAll'>
        <div className='text-centered'>
          <h2>¡Beneficios como amigo!</h2>
          <div className='display-flex'>
            <div className='home-post-it'>
            <img className='home-post-its-icon' src="/images/money-bag-myicon.png"></img>
              <h3>Gana dinero <br></br> extra</h3>
              <p>Establece tus propias tarifas y horas de disponibilidad.</p>
            </div>
            <div className='home-post-it'>
            <img className='home-post-its-icon' src="/images/conversation-myicon.png"></img>
              <h3>Comparte tus intereses</h3>
              <p>Conoce personas que comparten tus aficiones y pasatiempos.</p>
            </div>
            <div className='home-post-it'>
            <img className='home-post-its-icon' src="/images/share-myicon.png"></img>
              <h3>Ayuda a los demás</h3>
              <p>Brinda compañía y apoyo a personas que lo necesitan.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="home-faq-container" className='home-section home-section-hgtAll'>
        <div className='text-centered'>
          <h2>Preguntas Frecuentes</h2>
          <div className='display-flex' >
          <div className='text-lefted'>
            <div className='home-faq-text'>
              <b>¿Tienes alguna pregunta sobre Friender?</b>
              <p>¡No te preocupes! Aquí encontrarás las respuestas a las preguntas más comunes que nuestros usuarios suelen tener.</p>
              <br></br><p>Esta sección está diseñada para ayudarte a encontrar la información que necesitas de forma rápida y sencilla. 
                  Si no encuentras la respuesta a tu pregunta, no dudes en ponerte en contacto con nuestro equipo de atención al cliente.</p>
            </div>
            <Link className='btn btn-azul' to={"/preguntas-frecuentes"}>Leer más...</Link>
          </div>
          <img className='home-img faq-img' src="/images/home_girl2.jpeg"></img>
          </div>
        </div>
      </section>

      <section id="home-footer" >
        <div className='text-centered'>
          <p>© 2024 Friender, Inc.</p>
        </div>
      </section>
    </div>
  )
}

export default Home