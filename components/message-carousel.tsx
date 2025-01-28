import React from "react"
import { motion } from "framer-motion"
import { useState, useEffect, useRef } from "react"
import { BarChartIcon, Brain, Target, Award } from 'lucide-react'

const messages = [
  {
    text: "Ve tu desempeño",
    icon: BarChartIcon,
    color: "text-blue-600",
  },
  {
    text: "Mejora tus habilidades",
    icon: Brain,
    color: "text-green-600",
  },
  {
    text: "Alcanza tus metas",
    icon: Target,
    color: "text-purple-600",
  },
  {
    text: "Reconoce tus logros",
    icon: Award,
    color: "text-yellow-600",
  },
]

export function MessageCarousel() {
  const [items, setItems] = useState(messages)
  const carouselRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const interval = setInterval(() => {
      setItems((prevItems) => {
        const newItems = [...prevItems]
        const firstItem = newItems.shift()
        if (firstItem) {
          newItems.push(firstItem)
        }
        return newItems
      })
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (carouselRef.current) {
      carouselRef.current.style.transition = 'none'
      carouselRef.current.style.transform = 'translateX(0)'
      void carouselRef.current.offsetHeight
      carouselRef.current.style.transition = 'transform 0.5s ease'
      carouselRef.current.style.transform = 'translateX(-25%)'
    }
  }, [carouselRef]) // Removed unnecessary dependency: items

  return (
    <div className="w-full bg-gradient-to-r from-green-50 to-blue-50 shadow-md py-3 overflow-hidden">
      <div className="container mx-auto px-4 relative">
        <div ref={carouselRef} className="flex transition-transform duration-500 ease-in-out">
          {items.map((message, index) => (
            <motion.div
              key={index}
              className="flex items-center justify-center space-x-3 w-1/4 flex-shrink-0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              {React.createElement(message.icon, {
                className: `w-7 h-7 ${message.color}`,
              })}
              <span className={`text-xl font-semibold ${message.color} whitespace-nowrap`}>
                {message.text}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
