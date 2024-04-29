import React, { useEffect, useState } from 'react'
import './imagRegist.css'

const Foto = ( {foto, remover, index} ) => {

    const [previewImage, setPreviewImage] = useState('')

    const handlePreview = () => {
        setPreviewImage(foto);
    }

    const handleClose = () => {
        console.log(foto.name)
        remover(index)
    }
    return (
            // mount &&
            <div className='foto' key={index}>
            <div className='sobreponer'>
                <img 
                    src= {foto}
                    alt="Imagen" 
                    width={100} 
                    height={100} 
                    onClick={handlePreview}
                    className='imagen'
                />
                <button 
                    className='cerrar-img'
                    onClick={handleClose}
                >
                    X
                </button>
            </div>
            {
              previewImage &&
              <div className='preview' id='preview'>
                <div className='close-btn' onClick={() => setPreviewImage('')}>
                  <p>Cerrar</p>
                </div>
                <div className='image-preview' style={{backgroundImage : `url(${previewImage})`}}>

                </div>
              </div>
            }
        </div>
    )
}

export default Foto
