import { motion, AnimatePresence } from "framer-motion"
import { X, ShieldCheck, Users } from "lucide-react"

interface AdminChoiceModalProps {
  isOpen: boolean
  onClose: () => void
  onChoice: (choice: "admin" | "default") => void
}

export function AdminChoiceModal({ isOpen, onClose, onChoice }: AdminChoiceModalProps) {
  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      transition: {
        ease: "anticipate",
        duration: 0.3,
      },
    },
  }

  const buttonVariants = {
    hover: {
      scale: 1.05,
      boxShadow: "0px 5px 15px rgba(0,0,0,0.1)",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10,
      },
    },
    tap: { scale: 0.95 },
  }

  const iconVariants = {
    hidden: { y: 10, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20,
        delay: 0.2,
      },
    },
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="bg-white rounded-2xl p-8 max-w-md w-full relative overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <motion.div
              className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-green-400 to-blue-500"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.5 }}
            />
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
            >
              <X size={24} />
            </button>
            <motion.h2
              className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              Seleccione su destino
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <motion.button
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl transition-all duration-300 transform hover:rotate-1"
                onClick={() => onChoice("admin")}
              >
                <motion.div variants={iconVariants} initial="hidden" animate="visible">
                  <ShieldCheck size={48} />
                </motion.div>
                <span className="mt-4 text-lg font-semibold">Panel de Admin</span>
                <p className="mt-2 text-sm text-blue-100 text-center">Acceso a funciones administrativas</p>
              </motion.button>
              <motion.button
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl transition-all duration-300 transform hover:-rotate-1"
                onClick={() => onChoice("default")}
              >
                <motion.div variants={iconVariants} initial="hidden" animate="visible">
                  <Users size={48} />
                </motion.div>
                <span className="mt-4 text-lg font-semibold">Panel de evaluaciones</span>
                <p className="mt-2 text-sm text-green-100 text-center">Acceso a las evaluaciones de sus personas a cargo</p>
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

