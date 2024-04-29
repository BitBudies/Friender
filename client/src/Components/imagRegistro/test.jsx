import React, { useEffect, useState } from 'react'
import './imagRegist.css'

const Foto = ( {foto} ) => {

    const [imagen, setImagen] = useState('')
    const [previewImage, setPreviewImage] = useState('')
    const [mount, setMount] = useState(false)
    
    useEffect(() => {
        const reader =  new FileReader();
        reader.onload = function (e) {
            setImagen(e.target.result);
            setMount(true)
        }
        reader.readAsDataURL(foto)
    },[])

    const handlePreview = () => {
        const reader =  new FileReader();
        reader.onload = function (e) {
            setPreviewImage(e.target.result);
        }
        reader.readAsDataURL(foto)
    }

    const handleClose = () => {
        setMount(false)
    }
    return (
            mount &&
            <div className='foto'>
            <div className='sobreponer'>
                <img 
                    src= {imagen}
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
