import type React from "react"
import { motion } from "framer-motion"

export const ProfessionalBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <svg className="absolute w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: "#f3f4f6", stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: "#e5e7eb", stopOpacity: 1 }} />
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#grad1)" />
        {Array.from({ length: 50 }).map((_, i) => (
          <motion.circle
            key={i}
            r={Math.random() * 2 + 1}
            cx={`${Math.random() * 100}%`}
            cy={`${Math.random() * 100}%`}
            fill="#4b5563"
            initial={{ opacity: 0.1 }}
            animate={{
              opacity: [0.1, 0.3, 0.1],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: Math.random() * 5 + 5,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            }}
          />
        ))}
      </svg>
    </div>
  )
}

