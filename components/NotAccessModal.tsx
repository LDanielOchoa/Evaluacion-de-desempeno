"use client"

import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"

interface NoAccessModalProps {
  isOpen: boolean
  onClose: () => void
}

export function NoAccessModal({ isOpen, onClose }: NoAccessModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="bg-white rounded-lg p-8 max-w-md w-full m-4 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
              <X size={24} />
            </button>
            <motion.div initial={{ y: -20 }} animate={{ y: 0 }} className="text-center">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
                className="text-6xl mb-4"
              >
                🚫
              </motion.div>
              <h2 className="text-2xl font-bold mb-4">Sin Acceso</h2>
              <p className="text-gray-600">
                Lo sentimos, no tienes personas a tu cargo y por lo tanto no tienes acceso a esta sección.
              </p>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

