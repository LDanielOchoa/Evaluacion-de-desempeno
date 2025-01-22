"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"

export function JellyLoadingScreen() {
  const [rotation, setRotation] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setRotation((prev) => (prev + 120) % 360)
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-gradient-to-br from-green-400 to-green-600 z-50 flex items-center justify-center"
    >
      <div className="relative w-64 h-64">
        {/* Blob Background */}
        <motion.div
          className="absolute inset-0 bg-white/10 rounded-full filter blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
            borderRadius: ["50% 50% 50% 50%", "60% 40% 70% 30%", "50% 50% 50% 50%"],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />

        {/* Jelly Circles Container */}
        <div className="relative w-full h-full">
          {/* Main Jelly Circle */}
          <motion.div
            className="absolute inset-0 bg-white rounded-full"
            animate={{
              scale: [1, 1.2, 1],
              rotate: rotation,
            }}
            transition={{
              scale: {
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              },
              rotate: {
                duration: 0.6,
                ease: [0.65, 0, 0.35, 1],
              },
            }}
            style={{
              filter: "brightness(0.9) contrast(1.2)",
              opacity: 0.2,
            }}
          />

          {/* Orbiting Jelly Circles */}
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-16 h-16 left-1/2 top-1/2"
              animate={{
                rotate: [0, 360],
                scale: [1, 1.2, 1],
              }}
              transition={{
                rotate: {
                  duration: 3 + i,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "linear",
                },
                scale: {
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                  delay: i * 0.3,
                },
              }}
              style={{
                originX: "1.8",
                originY: "1.8",
              }}
            >
              <motion.div
                className="w-full h-full bg-white rounded-full"
                animate={{
                  scale: [1, 1.3, 1],
                  borderRadius: ["50%", "40%", "50%"],
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                  delay: i * 0.2,
                }}
                style={{
                  filter: "brightness(1.1)",
                  opacity: 0.3,
                }}
              />
            </motion.div>
          ))}

          {/* Center Pulsing Circle */}
          <motion.div
            className="absolute left-1/2 top-1/2 w-24 h-24 -ml-12 -mt-12 bg-white rounded-full"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 0.8, 0.5],
              borderRadius: ["50%", "45%", "50%"],
            }}
            transition={{
              duration: 3,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />

          {/* Floating Dots */}
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white rounded-full"
              style={{
                left: "50%",
                top: "50%",
                opacity: 0.4,
              }}
              animate={{
                x: Math.cos((i / 12) * Math.PI * 2) * 100,
                y: Math.sin((i / 12) * Math.PI * 2) * 100,
                scale: [1, 1.5, 1],
                opacity: [0.4, 0.7, 0.4],
              }}
              transition={{
                duration: 3,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
                delay: i * 0.1,
              }}
            />
          ))}
        </div>

        {/* Text with Jelly Effect */}
        <motion.div
          className="absolute bottom-[-60px] left-1/2 transform -translate-x-1/2 text-white text-xl font-medium"
          animate={{
            scale: [1, 1.05, 1],
            y: [0, -5, 0],
          }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        >
          Cargando
          <motion.span
            animate={{
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          >
            ...
          </motion.span>
        </motion.div>
      </div>

      {/* Background Floating Elements */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={`float-${i}`}
          className="absolute w-4 h-4 bg-white rounded-full"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            opacity: 0.1,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, Math.random() * 20 - 10, 0],
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{
            duration: Math.random() * 3 + 2,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: Math.random() * 2,
          }}
        />
      ))}
    </motion.div>
  )
}

