import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"

interface NotFoundModalProps {
  isOpen: boolean
  onClose: () => void
}

export function NotFoundModal({ isOpen, onClose }: NotFoundModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="bg-white rounded-lg p-6 max-w-sm w-full shadow-xl"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-red-600">Cédula no encontrada</h2>
              <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>
            <p className="text-gray-700 mb-4">
              Lo sentimos, la cédula ingresada no se encuentra en nuestra base de datos. Por favor, verifique el número
              e intente nuevamente.
            </p>
            <button
              onClick={onClose}
              className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition duration-200"
            >
              Cerrar
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

