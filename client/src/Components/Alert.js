import React from 'react'
import { useGlobalContext } from '../context'

const Alert = () => {
    const {alert} = useGlobalContext();
  return (
    <div className={`${!alert.status && "hide-alert"} alert alert-${alert.type} general-alert`}>
      <p>{alert.message}</p>
    </div>
  )
}

export default Alert
