import { useEffect, useRef } from 'react'

class Particle {
  constructor(canvasWidth, canvasHeight) {
    this.x = Math.random() * canvasWidth
    this.y = Math.random() * canvasHeight
    this.vx = (Math.random() - 0.5) * 0.5
    this.vy = (Math.random() - 0.5) * 0.5
    this.radius = Math.random() * 2 + 1
    this.opacity = Math.random() * 0.5 + 0.3
    this.canvasWidth = canvasWidth
    this.canvasHeight = canvasHeight
  }

  update() {
    this.x += this.vx
    this.y += this.vy
    if (this.x < 0 || this.x > this.canvasWidth) this.vx *= -1
    if (this.y < 0 || this.y > this.canvasHeight) this.vy *= -1
  }

  draw(ctx) {
    ctx.save()
    ctx.globalAlpha = this.opacity
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
    ctx.fillStyle = '#374151'
    ctx.fill()
    ctx.restore()
  }
}

function drawConnections(ctx, particles, maxDistance) {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x
      const dy = particles[i].y - particles[j].y
      const distance = Math.sqrt(dx * dx + dy * dy)
      if (distance < maxDistance) {
        ctx.save()
        ctx.globalAlpha = (1 - distance / maxDistance) * 0.15
        ctx.beginPath()
        ctx.moveTo(particles[i].x, particles[i].y)
        ctx.lineTo(particles[j].x, particles[j].y)
        ctx.strokeStyle = '#6b7280'
        ctx.lineWidth = 1
        ctx.stroke()
        ctx.restore()
      }
    }
  }
}

export default function ParticleBackground() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    let animationId
    const particles = []
    const particleCount = 50
    const maxDistance = 150

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }

    const initializeParticles = () => {
      particles.length = 0
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle(canvas.width, canvas.height))
      }
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.forEach((p) => {
        p.update()
        p.draw(ctx)
      })
      drawConnections(ctx, particles, maxDistance)
      animationId = requestAnimationFrame(animate)
    }

    resizeCanvas()
    initializeParticles()
    animate()

    window.addEventListener('resize', resizeCanvas)
    // eslint-disable-next-line consistent-return
    return () => {
      window.removeEventListener('resize', resizeCanvas)
      cancelAnimationFrame(animationId)
    }
  }, [])

  return (
    <>
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 1,
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 2,
          background:
            'radial-gradient(ellipse at center, rgba(255,255,255,0.3) 0%, rgba(248,249,250,0.02) 35%, rgba(241,243,244,0.03) 70%, rgba(255,255,255,0.1) 100%)',
        }}
      />
    </>
  )
}
