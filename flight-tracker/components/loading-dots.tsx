"use client"

import { useEffect, useState } from "react"

export default function LoadingDots() {
  const [dots, setDots] = useState("")

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => {
        if (prev.length >= 3) return ""
        return prev + "."
      })
    }, 400)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex items-center space-x-1">
      <div className="h-2 w-2 bg-blue-600 rounded-full animate-pulse" />
      <div className="h-2 w-2 bg-blue-600 rounded-full animate-pulse delay-150" />
      <div className="h-2 w-2 bg-blue-600 rounded-full animate-pulse delay-300" />
      <span className="sr-only">Loading</span>
    </div>
  )
}
