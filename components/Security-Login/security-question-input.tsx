import { motion } from "framer-motion"
import { Input } from "@/components/ui/input"
import type { DogIcon as Pet, Calendar, Book, Hash } from "lucide-react"

interface SecurityQuestionInputProps {
  question: {
    id: string
    label: string
    icon: typeof Pet | typeof Calendar | typeof Book | typeof Hash
  }
  answer: string
  setAnswer: (answer: string) => void
}

export function SecurityQuestionInput({ question, answer, setAnswer }: SecurityQuestionInputProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Input
        type="text"
        placeholder={`Respuesta: ${question.label}`}
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        className="border-green-300 focus:ring-green-500 focus:border-green-500"
        icon={<question.icon className="w-5 h-5 text-green-500" />}
      />
    </motion.div>
  )
}

