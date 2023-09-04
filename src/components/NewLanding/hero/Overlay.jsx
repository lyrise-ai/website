import React from 'react'

function Overlay({ clearActiveItem }) {
  return (
    <div
      onClick={clearActiveItem}
      className="fixed z-10 top-0 right-0 left-0 bottom-0 bg-blue-900 overlay-entry-animation"
    ></div>
  )
}

export default Overlay
