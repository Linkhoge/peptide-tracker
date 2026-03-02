import { useState } from 'react'

function Tooltip({ children, content, delay = 200 }) {
  const [show, setShow] = useState(false)
  const [timeoutId, setTimeoutId] = useState(null)

  const handleMouseEnter = () => {
    const id = setTimeout(() => setShow(true), delay)
    setTimeoutId(id)
  }

  const handleMouseLeave = () => {
    if (timeoutId) clearTimeout(timeoutId)
    setShow(false)
  }

  return (
    <div
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      {show && content && (
        <div className="absolute z-50 left-full ml-2 top-0 w-80 pointer-events-none">
          <div className="bg-dark-card border border-accent-primary/30 rounded-lg p-3 shadow-glow-md">
            {content}
          </div>
        </div>
      )}
    </div>
  )
}

export default Tooltip