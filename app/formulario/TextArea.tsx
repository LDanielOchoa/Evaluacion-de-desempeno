import type React from "react"
import { useState, useCallback } from "react"
import { motion } from "framer-motion"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

interface TextAreaInputProps {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
}

export const TextAreaInput: React.FC<TextAreaInputProps> = ({ id, label, value, onChange }) => {
  const [localValue, setLocalValue] = useState(value)

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setLocalValue(e.target.value)
  }

  const handleBlur = useCallback(() => {
    onChange(localValue)
  }, [onChange, localValue])

  return (
    <motion.div
      layout
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } },
      }}
      initial="hidden"
      animate="visible"
      className="bg-gradient-to-br from-white/60 to-white/30 backdrop-blur-sm rounded-2xl p-4 sm:p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-white/50"
      whileHover={{ scale: 1.02 }}
    >
      <Label htmlFor={id} className="block text-xl font-medium text-green-800 mb-4">
        {label}
      </Label>
      <Textarea
        id={id}
        name={id}
        className="w-full p-4 border-2 border-green-200 rounded-xl focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-200 bg-white/70 backdrop-blur-sm resize-y"
        value={localValue}
        onChange={handleChange}
        onBlur={handleBlur}
        required
        rows={4}
        placeholder="Escribe aquí..."
      />
    </motion.div>
  )
}

