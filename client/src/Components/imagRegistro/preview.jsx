import React, { useEffect, useState } from 'react'
import './preview.css'
import { IoMdClose } from "react-icons/io";

const Preview = ( {foto, handleClose} ) => {

    return (
        foto &&
        <div className='preview' id='preview'>
          <div className='close-btn' >
            <label
              className='icon'
              onClick={handleClose}>
              <IoMdClose size={50}/>
            </label>
          </div>
          <div className='image-preview' style={{backgroundImage : `url(${foto})`}}>
          </div>
        </div>
    )
}

export default Preview
