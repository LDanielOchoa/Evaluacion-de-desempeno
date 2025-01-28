import { motion } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Book } from "lucide-react"

interface SecretWordQuestionProps {
  answer: string
  setAnswer: (value: string) => void
  confirmAnswer: string
  setConfirmAnswer: (value: string) => void
  error: string
  setError: (value: string) => void
}

export function SecretWordQuestion({
  answer,
  setAnswer,
  confirmAnswer,
  setConfirmAnswer,
  error,
  setError,
}: SecretWordQuestionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-4"
    >
      <div className="flex items-center space-x-2 text-green-600">
        <Book className="w-6 h-6" />
        <h3 className="text-lg font-semibold">Una palabra secreta</h3>
      </div>
      <Input
        type="text"
        placeholder="Ingresa una palabra secreta"
        value={answer}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          setAnswer(e.target.value)
          setError("")
        }}
        className="border-green-300 focus:ring-green-500 focus:border-green-500"
      />
      <Input
        type="text"
        placeholder="Confirma tu palabra secreta"
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
        Esta palabra será guardada y podrá ser utilizada para recuperar tu cuenta en caso de olvido de contraseña.
      </p>
    </motion.div>
  )
}

