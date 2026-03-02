import { useEffect, useRef } from 'react'

function WireframeGrid() {
  const gridRef = useRef(null)
  const mouseX = useRef(0)
  const mouseY = useRef(0)
  const currentX = useRef(0)
  const currentY = useRef(0)

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseX.current = (e.clientX / window.innerWidth - 0.5) * 20
      mouseY.current = (e.clientY / window.innerHeight - 0.5) * 20
    }

    window.addEventListener('mousemove', handleMouseMove)

    const animate = () => {
      if (gridRef.current) {
        currentX.current += (mouseX.current - currentX.current) * 0.05
        currentY.current += (mouseY.current - currentY.current) * 0.05

        gridRef.current.style.transform = `
          perspective(1000px)
          rotateX(${60 + currentY.current}deg)
          rotateZ(${currentX.current}deg)
          translateZ(-100px)
        `
      }
      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  return (
    <div className="wireframe-grid-container">
      <div ref={gridRef} className="wireframe-grid">
        {/* Horizontal lines */}
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={`h-${i}`}
            className="wireframe-line wireframe-line-horizontal"
            style={{
              top: `${i * 5}%`,
              animationDelay: `${i * 0.1}s`
            }}
          />
        ))}
        {/* Vertical lines */}
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={`v-${i}`}
            className="wireframe-line wireframe-line-vertical"
            style={{
              left: `${i * 5}%`,
              animationDelay: `${i * 0.1}s`
            }}
          />
        ))}
        {/* Accent dots at intersections */}
        {Array.from({ length: 12 }).map((_, i) => {
          const row = Math.floor(i / 4)
          const col = i % 4
          return (
            <div
              key={`dot-${i}`}
              className="wireframe-dot"
              style={{
                left: `${25 + col * 16.66}%`,
                top: `${25 + row * 25}%`,
                animationDelay: `${i * 0.2}s`
              }}
            />
          )
        })}
      </div>
    </div>
  )
}

export default WireframeGrid
