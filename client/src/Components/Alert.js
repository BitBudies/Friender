import React from 'react'
import { useGlobalContext } from '../context'

const Alert = () => {
    const {alert} = useGlobalContext();
  return (
    <div className={`${!alert.status && "hide-alert"} alert alert-${alert.type} general-alert`}>
      {alert.message}
    </div>
  )
}

export default Alert
