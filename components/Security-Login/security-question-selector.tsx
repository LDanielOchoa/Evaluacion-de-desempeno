import React from "react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { DogIcon, Calendar, Book, Hash, ArrowLeft } from "lucide-react"
import { PetNameQuestion } from "./pet-name-question"
import { ImportantDateQuestion } from "./important-date-question"
import { SecretWordQuestion } from "./secret-word-question"
import { SecretNumberQuestion } from "./secret-number-question"

interface SecurityQuestionSelectorProps {
  onSubmit: (question: string, answer: string) => void
}

const securityQuestions = [
  { id: "mascota", label: "Nombre de tu mascota", icon: DogIcon, component: PetNameQuestion },
  { id: "fecha", label: "Una fecha importante", icon: Calendar, component: ImportantDateQuestion },
  { id: "palabra", label: "Una palabra secreta", icon: Book, component: SecretWordQuestion },
  { id: "numero", label: "Un número secreto", icon: Hash, component: SecretNumberQuestion },
]

export function SecurityQuestionSelector({ onSubmit }: SecurityQuestionSelectorProps) {
  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null)
  const [answer, setAnswer] = useState("")
  const [confirmAnswer, setConfirmAnswer] = useState("")
  const [error, setError] = useState("")

  const handleQuestionSelect = (questionId: string) => {
    setSelectedQuestion(questionId)
    setAnswer("")
    setConfirmAnswer("")
    setError("")
  }

  const handleBack = () => {
    setSelectedQuestion(null)
    setAnswer("")
    setConfirmAnswer("")
    setError("")
  }

  const handleSubmit = () => {
    if (!selectedQuestion || !answer || !confirmAnswer) {
      setError("Por favor complete todos los campos")
      return
    }

    if (answer !== confirmAnswer) {
      setError("Las respuestas no coinciden. Por favor, inténtalo de nuevo.")
      return
    }

    onSubmit(selectedQuestion, answer)
  }

  return (
    <AnimatePresence mode="wait">
      {!selectedQuestion ? (
        <motion.div
          key="question-grid"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="grid grid-cols-2 gap-4"
        >
          {securityQuestions.map((question) => (
            <motion.div
              key={question.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-4 rounded-lg cursor-pointer bg-gray-100 hover:bg-green-100 transition-colors duration-200"
              onClick={() => handleQuestionSelect(question.id)}
            >
              <question.icon className="w-8 h-8 text-green-500 mb-2" />
              <p className="text-sm font-medium">{question.label}</p>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.div
          key="question-detail"
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          className="space-y-4"
        >
          <Button variant="ghost" onClick={handleBack} className="mb-4 text-green-600 hover:text-green-700">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a las opciones
          </Button>
          {selectedQuestion && (
            <div className="mt-4">
              {(() => {
                const QuestionComponent = securityQuestions.find((q) => q.id === selectedQuestion)?.component || "div"
                return (
                  <QuestionComponent
                    answer={answer}
                    setAnswer={setAnswer}
                    confirmAnswer={confirmAnswer}
                    setConfirmAnswer={setConfirmAnswer}
                    error={error}
                    setError={setError}
                  />
                )
              })()}
            </div>
          )}
          <Button
            onClick={handleSubmit}
            className="w-full bg-green-500 hover:bg-green-600 text-white"
            disabled={!answer || !confirmAnswer || !selectedQuestion}
          >
            Guardar respuesta
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

