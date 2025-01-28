"use client"

import type React from "react"
import { motion } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface TextInputProps {
  id: string
  label: string
  required?: boolean
  disabled?: boolean
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 100 },
  },
}

export const TextInput: React.FC<TextInputProps> = ({
  id,
  label,
  required = false,
  disabled = false,
  value,
  onChange,
}) => (
  <motion.div variants={itemVariants} initial="hidden" animate="visible" className="mb-4" whileHover={{ scale: 1.02 }}>
    <Label htmlFor={id} className="block text-sm font-medium text-green-800 mb-2">
      {label} {required && <span className="text-red-500">*</span>}
    </Label>
    <Input
      type="text"
      id={id}
      name={id}
      required={required}
      disabled={disabled}
      className="w-full p-2 border-2 border-green-200 rounded-xl focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-200 bg-white/70 backdrop-blur-sm uppercase"
      value={value}
      onChange={onChange}
    />
  </motion.div>
)

