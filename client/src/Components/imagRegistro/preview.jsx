import React, { useEffect, useState } from 'react'
import './preview.css'

const Preview = ( {foto, handleClose} ) => {

    return (
        foto &&
        <div className='preview' id='preview'>
          <div className='close-btn' >
            <button
              onClick={handleClose}>
              Cerrar
            </button>
          </div>
          <div className='image-preview' style={{backgroundImage : `url(${foto})`}}>
          </div>
        </div>
    )
}

export default Preview
