import React, { useState, useEffect, useRef } from 'react'
import styles from './styles.module.css'
import { Grow } from '@mui/material'
import Link from 'next/link'
import { FaArrowRight } from 'react-icons/fa'

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

const drawConnections = (ctx, particles, maxDistance) => {
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

function HeroSection() {
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

      particles.forEach((particle) => {
        particle.update()
        particle.draw(ctx)
      })

      drawConnections(ctx, particles, maxDistance)
      animationId = requestAnimationFrame(animate)
    }

    resizeCanvas()
    initializeParticles()
    animate()

    const handleResize = () => resizeCanvas()
    window.addEventListener('resize', handleResize)

    // eslint-disable-next-line consistent-return
    return () => {
      window.removeEventListener('resize', handleResize)
      if (animationId) {
        cancelAnimationFrame(animationId)
      }
    }
  }, [])

  return (
    <>
      <section
        id="Section1"
        className={`${styles.heroSection} flex items-center justify-center h-[50vh] md:h-[80vh] w-full relative overflow-hidden`}
      >
        <canvas ref={canvasRef} className={styles.particleCanvas} />

        <div className={styles.gradientOverlay}></div>

        <div className="flex flex-col items-center gap-10 relative z-10">
          <div className="flex flex-col items-center justify-start gap-2 md:gap-0">
            <h2 className="font-outfit text-center text-[32px] md:text-[64px] font-bold text-[#2C2C2C] leading-[100%]">
              The Platform For
            </h2>
            <h2 className="font-outfit text-center text-[32px] md:text-[64px] font-bold text-[#2C2C2C] ">
              Companies To 3X Profits
            </h2>
            <h3 className="font-outfit text-[20px] text-[#2C2C2C] text-center md:max-w-[45vw] lg:max-w-[35vw]">
              Guranteed Results with our AI-Agents
            </h3>
          </div>

          <Link
            href="/roi-report"
            className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white transition-all transform bg-[#2C2C2C] rounded-full hover:bg-black hover:-translate-y-0.5 shadow-lg hover:shadow-gray-500/30 group"
          >
            Get Your ROI Report
            <FaArrowRight className="ml-2 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </section>
    </>
  )
}

export default HeroSection

const PlugnnHireBtn = () => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className={` ${styles.floatingBtn0} absolute  rounded-full w-fit p-1 lg:p-2 px-2 lg:px-3 flex flex-row items-center justify-center gap-3 cursor-pointer ${styles.btnGradient0} `}
    >
      <a
        href="https://plugnhire.lyrise.ai"
        target="_blank"
        rel="noopener noreferrer"
        className={`rounded-full ${styles.btn0} px-5 lg:px-10 py-1 lg:py-2 text-[16px] font-[400]focus:outline-none  text-[#FFFDFA]`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        PlugnHire
      </a>
      {isHovered && (
        <Grow
          in={isHovered}
          style={{ transformOrigin: '0 ' }}
          {...(isHovered ? { timeout: 500 } : {})}
        >
          <div className="">AI Agents for your Recruiting Team</div>
        </Grow>
      )}
    </div>
  )
}

const GetYourAgentBtn = () => {
  return (
    <div
      className={`${styles.floatingBtn1} absolute rounded-full w-fit  p-2 px-3 flex flex-row items-center justify-center gap-3 cursor-pointer ml-[-115px] `}
    >
      <div className="group relative text-[18px] lg:text-[24px] flex items-center justify-center gap-2 p-1 lg:p-2 px-2 lg:px-4 leading-[24px]  rounded-[30px] text-white bg-new-black transition-colors hover:bg-new-black/85 ">
        Map Your Process Now!
      </div>
    </div>
  )
}

const CommingSoonBtn = () => {
  return (
    <div
      className={`${styles.floatingBtn2} absolute  rounded-full w-fit  p-2 px-3 flex flex-row items-center justify-center gap-3 cursor-pointer ${styles.btnGradient2} `}
    >
      <div
        className={`rounded-full ${styles.btn2} px-3 lg:px-5 py-1 lg:py-2 text-[14px] lg:text-[16px] font-[400]focus:outline-none  text-[#FFFDFA]`}
      >
        Comming Soon
      </div>
    </div>
  )
}
