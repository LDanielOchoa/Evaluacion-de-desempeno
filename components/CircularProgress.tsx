import type React from "react"
import { motion } from "framer-motion"

interface CircularProgressProps {
  percentage: number
  color: string
}

export const CircularProgress: React.FC<CircularProgressProps> = ({ percentage, color }) => {
  const circumference = 2 * Math.PI * 40 // 40 is the radius of the circle

  return (
    <div className="relative w-24 h-24">
      <svg className="w-full h-full" viewBox="0 0 100 100">
        <circle className="text-gray-200 stroke-current" strokeWidth="10" cx="50" cy="50" r="40" fill="transparent" />
        <motion.circle
          className={`${color} stroke-current`}
          strokeWidth="10"
          strokeLinecap="round"
          cx="50"
          cy="50"
          r="40"
          fill="transparent"
          initial={{ strokeDasharray: circumference, strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference - (percentage / 100) * circumference }}
          transition={{ duration: 1, ease: "easeInOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-2xl font-bold">{percentage.toFixed(0)}%</span>
      </div>
    </div>
  )
}

