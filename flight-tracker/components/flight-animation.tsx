"use client"

import { useEffect, useRef } from "react"

export default function FlightAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const setCanvasDimensions = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    setCanvasDimensions()
    window.addEventListener("resize", setCanvasDimensions)

    // Create plane objects
    const planes = Array.from({ length: 15 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 10 + 5,
      speed: Math.random() * 2 + 1,
      color: `rgba(59, 130, 246, ${Math.random() * 0.5 + 0.2})`,
      angle: Math.random() * Math.PI * 2,
    }))

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw planes
      planes.forEach((plane) => {
        ctx.save()
        ctx.translate(plane.x, plane.y)
        ctx.rotate(plane.angle)

        // Draw plane
        ctx.fillStyle = plane.color
        ctx.beginPath()
        ctx.moveTo(plane.size, 0)
        ctx.lineTo(-plane.size, plane.size / 2)
        ctx.lineTo(-plane.size / 2, 0)
        ctx.lineTo(-plane.size, -plane.size / 2)
        ctx.closePath()
        ctx.fill()

        // Update position
        plane.x += Math.cos(plane.angle) * plane.speed
        plane.y += Math.sin(plane.angle) * plane.speed

        // Reset position if out of bounds
        if (
          plane.x < -plane.size ||
          plane.x > canvas.width + plane.size ||
          plane.y < -plane.size ||
          plane.y > canvas.height + plane.size
        ) {
          plane.x = Math.random() > 0.5 ? canvas.width + plane.size : -plane.size
          plane.y = Math.random() * canvas.height
          plane.angle = Math.random() * Math.PI * 2
        }

        ctx.restore()
      })

      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", setCanvasDimensions)
    }
  }, [])

  return <canvas ref={canvasRef} className="w-full h-full" />
}
