import React, { useEffect, useState } from 'react'
import './imagRegist.css'
import { FaTrashAlt } from "react-icons/fa";

const Foto = ( {foto, remover, index, setPreview, conX} ) => {

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
                {
                    conX &&
                    <label 
                        className='cerrar-img'
                        onClick={handleClose}
                    >
                        <FaTrashAlt />
                    </label>       
                }
                
            </div>
        </div>
    )
}

export default Foto
