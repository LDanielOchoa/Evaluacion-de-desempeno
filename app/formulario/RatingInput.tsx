import { motion } from "framer-motion"
import { Star } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface RatingInputProps {
  name: string
  label: string
  section: string
  value: number
  updateFormData: (section: string, field: string, value: number) => void
}

export const RatingInput: React.FC<RatingInputProps> = ({ name, label, section, value: rating, updateFormData }) => {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } },
      }}
      initial="hidden"
      animate="visible"
      className="mb-8 bg-gradient-to-br from-green-50/80 to-green-100/50 backdrop-blur-sm rounded-2xl p-4 sm:p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-white/50"
      whileHover={{ scale: 1.02 }}
    >
      <Label htmlFor={name} className="block text-lg sm:text-xl font-medium text-green-900 mb-4 sm:mb-6">
        {label}
      </Label>
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center justify-between w-full sm:w-auto">
          <span className="text-xs sm:text-sm font-medium text-green-800 bg-green-100/50 px-2 sm:px-3 py-1 rounded-full">
            Malo
          </span>
          <span className="text-xs sm:text-sm font-medium text-green-800 bg-green-100/50 px-2 sm:px-3 py-1 rounded-full sm:hidden">
            Bueno
          </span>
        </div>
        <div className="flex gap-1 sm:gap-2 md:gap-4">
          {[1, 2, 3, 4].map((starValue) => (
            <motion.label
              key={starValue}
              className="cursor-pointer relative group"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Input
                type="radio"
                name={name}
                value={starValue}
                className="sr-only"
                onChange={() => updateFormData(section, name, starValue)}
                checked={rating === starValue}
              />
              <Star
                className={`w-8 h-8 sm:w-10 sm:h-10 transition-colors duration-200 ${
                  rating >= starValue
                    ? starValue >= 3
                      ? "text-green-500"
                      : starValue === 2
                        ? "text-yellow-500"
                        : "text-red-500"
                    : "text-gray-300"
                }`}
                fill={rating >= starValue ? "currentColor" : "none"}
                strokeWidth={1.5}
              />
              <motion.div
                className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
              >
                <span className="text-xs font-medium text-green-700 whitespace-nowrap bg-white/80 px-2 py-1 rounded-full shadow-sm">
                  {starValue}
                </span>
              </motion.div>
            </motion.label>
          ))}
        </div>
        <span className="hidden sm:inline-block text-xs sm:text-sm font-medium text-green-800 bg-green-100/50 px-2 sm:px-3 py-1 rounded-full">
          Bueno
        </span>
      </div>
    </motion.div>
  )
}

