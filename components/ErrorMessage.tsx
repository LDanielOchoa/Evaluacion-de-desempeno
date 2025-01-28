import { motion, AnimatePresence } from "framer-motion"
import { AlertCircle } from "lucide-react"

interface ErrorMessageProps {
  message: string
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="flex items-center p-4 mb-4 text-sm text-red-800 border border-red-300 rounded-lg bg-red-50"
          role="alert"
        >
          <AlertCircle className="flex-shrink-0 inline w-4 h-4 mr-3" />
          <span className="sr-only">Error</span>
          <div>{message}</div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

