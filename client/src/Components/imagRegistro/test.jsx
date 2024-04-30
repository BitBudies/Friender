import React, { useEffect, useState } from 'react'
import './imagRegist.css'

const Foto = ( {foto, remover, index, setPreview} ) => {

    const [previewImage, setPreviewImage] = useState('')
    

    const handlePreview = () => {
        setPreview(foto);
    }

    const handleClose = () => {
        remover(index)
    }
    return (
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
        </div>
    )
}

export default Foto
