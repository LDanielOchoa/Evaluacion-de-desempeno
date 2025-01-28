import { motion } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Calendar } from "lucide-react"

interface ImportantDateQuestionProps {
  answer: string
  setAnswer: (value: string) => void
  confirmAnswer: string
  setConfirmAnswer: (value: string) => void
  error: string
  setError: (value: string) => void
}

export function ImportantDateQuestion({
  answer,
  setAnswer,
  confirmAnswer,
  setConfirmAnswer,
  error,
  setError,
}: ImportantDateQuestionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-4"
    >
      <div className="flex items-center space-x-2 text-green-600">
        <Calendar className="w-6 h-6" />
        <h3 className="text-lg font-semibold">Una fecha importante</h3>
      </div>
      <Input
        type="date"
        value={answer}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          setAnswer(e.target.value)
          setError("")
        }}
        className="border-green-300 focus:ring-green-500 focus:border-green-500"
      />
      <Input
        type="date"
        value={confirmAnswer}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          setConfirmAnswer(e.target.value)
          setError("")
        }}
        className="border-green-300 focus:ring-green-500 focus:border-green-500"
      />
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="text-red-500 text-sm"
        >
          {error}
        </motion.p>
      )}
      <p className="text-sm text-gray-500">
        Esta fecha será guardada y podrá ser utilizada para recuperar tu cuenta en caso de olvido de contraseña.
      </p>
    </motion.div>
  )
}

