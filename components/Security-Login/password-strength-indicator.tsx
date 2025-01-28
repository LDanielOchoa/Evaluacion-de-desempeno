import { motion } from "framer-motion"

interface PasswordStrengthIndicatorProps {
  strength: number
}

export function PasswordStrengthIndicator({ strength }: PasswordStrengthIndicatorProps) {
  const getColor = (strength: number) => {
    if (strength <= 25) return "bg-red-500"
    if (strength <= 50) return "bg-orange-500"
    if (strength <= 75) return "bg-yellow-500"
    return "bg-green-500"
  }

  const getText = (strength: number) => {
    if (strength <= 25) return "Débil"
    if (strength <= 50) return "Regular"
    if (strength <= 75) return "Buena"
    return "Fuerte"
  }

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-500">Fortaleza de la contraseña:</span>
        <motion.span
          className="text-sm font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          key={getText(strength)}
        >
          {getText(strength)}
        </motion.span>
      </div>
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <motion.div
          className={`h-full ${getColor(strength)}`}
          initial={{ width: 0 }}
          animate={{ width: `${strength}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
      </div>
    </div>
  )
}

