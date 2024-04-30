import React from 'react'

const Interes = ( {interes, remover, index} ) => {

    const handleClose = () => {
        remover(index)
    }

  return (
    <div className='interes' 
        key={index}
        onClick={handleClose}
        >
        <strong>{interes}</strong>
    </div>
  )
}

export default Interes