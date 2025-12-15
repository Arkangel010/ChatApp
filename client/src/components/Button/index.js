import React from 'react'

const Button = ({
    label = '', 
    type = '', 
    className = '',
    disabled = false, 
}) => {
  return (
      <button type={type} className={`bg-primary border border-gray-300 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5  ${className}`} disabled={disabled}>{label}</button>
  )
}

export default Button