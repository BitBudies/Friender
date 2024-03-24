import React from 'react'
import "./Home.css"
import Test from '../features/Test/Test'

const Home = () => {

  return (
    <div id='home_section' className='page'>
      <div className='section'>
        {/* <div className='section-text'>
          <div>
            <h1>Friender home page</h1>
            <p>En desarrollo</p>
          </div>
          
        </div> */}
        <div className='section-image'>
          <div className='image' style={{backgroundImage: `url(${"/images/home_girl2.jpeg"})`}}></div>
        </div>
      </div>
      <Test/>
    </div>
  )
}

export default Home
