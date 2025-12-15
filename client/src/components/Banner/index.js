import React from 'react'

const Banner = ({
    className = '',
    headClassName = ''
}
) => {
  return (
    <div className={className}>
        <h1 className={headClassName}>TalkIt</h1>
    </div>
  )
}

export default Banner