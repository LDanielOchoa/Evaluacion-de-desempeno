"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Shield, Key, CheckCircle, AlertCircle, ChevronRight } from "lucide-react"

interface SecurityModalProps {
  isOpen: boolean
  onClose: () => void
  userData: any
  onSecurityUpdate: (updatedData: any) => void
}

export function SecurityModal({ isOpen, onClose, userData, onSecurityUpdate }: SecurityModalProps) {
  const [step, setStep] = useState(1)
  const [oldPassword, setOldPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [securityQuestion, setSecurityQuestion] = useState("")
  const [securityAnswer, setSecurityAnswer] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      setError("Las contraseñas no coinciden")
      return
    }

    try {
      const response = await fetch("https://evaluacion-de-desempeno.onrender.com/change_password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: userData.username,
          oldPassword,
          newPassword,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setSuccess("Contraseña actualizada correctamente")
        setTimeout(() => {
          setSuccess("")
          setStep(2)
        }, 2000)
      } else {
        setError(data.error || "Error al cambiar la contraseña")
      }
    } catch (error) {
      setError("Error al cambiar la contraseña")
    }
  }

  const handleSecurityQuestionUpdate = async () => {
    try {
      const response = await fetch("https://evaluacion-de-desempeno.onrender.com/update_security_question", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: userData.username,
          securityQuestion,
          securityAnswer,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setSuccess("Pregunta de seguridad actualizada correctamente")
        setTimeout(() => {
          onSecurityUpdate({ ...userData, requiresSecurityUpdate: false })
          onClose()
        }, 2000)
      } else {
        setError(data.error || "Error al actualizar la pregunta de seguridad")
      }
    } catch (error) {
      setError("Error al actualizar la pregunta de seguridad")
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-lg p-8 max-w-md w-full shadow-2xl"
          >
            <div className="flex items-center mb-6">
              <Shield className="w-8 h-8 text-green-500 mr-3" />
              <h2 className="text-2xl font-bold text-green-700">Actualización de Seguridad</h2>
            </div>
            <motion.div
              key={step}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {step === 1 ? (
                <div className="space-y-4">
                  <Input
                    type="password"
                    placeholder="Contraseña actual"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    className="border-green-300 focus:ring-green-500 focus:border-green-500"
                  />
                  <Input
                    type="password"
                    placeholder="Nueva contraseña"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="border-green-300 focus:ring-green-500 focus:border-green-500"
                  />
                  <Input
                    type="password"
                    placeholder="Confirmar nueva contraseña"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="border-green-300 focus:ring-green-500 focus:border-green-500"
                  />
                  <AnimatePresence>
                    {error && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="text-red-500 flex items-center"
                      >
                        <AlertCircle className="w-4 h-4 mr-2" />
                        {error}
                      </motion.p>
                    )}
                    {success && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="text-green-500 flex items-center"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        {success}
                      </motion.p>
                    )}
                  </AnimatePresence>
                  <Button onClick={handlePasswordChange} className="w-full bg-green-500 hover:bg-green-600 text-white">
                    <Key className="w-4 h-4 mr-2" />
                    Cambiar contraseña
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <Select onValueChange={setSecurityQuestion}>
                    <SelectTrigger className="border-green-300 focus:ring-green-500 focus:border-green-500">
                      <SelectValue placeholder="Seleccione una pregunta de seguridad" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mascota">Nombre de tu mascota</SelectItem>
                      <SelectItem value="palabra">Una palabra secreta</SelectItem>
                      <SelectItem value="numero">Un número secreto</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    type="text"
                    placeholder="Respuesta a la pregunta de seguridad"
                    value={securityAnswer}
                    onChange={(e) => setSecurityAnswer(e.target.value)}
                    className="border-green-300 focus:ring-green-500 focus:border-green-500"
                  />
                  <AnimatePresence>
                    {error && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="text-red-500 flex items-center"
                      >
                        <AlertCircle className="w-4 h-4 mr-2" />
                        {error}
                      </motion.p>
                    )}
                    {success && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="text-green-500 flex items-center"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        {success}
                      </motion.p>
                    )}
                  </AnimatePresence>
                  <Button
                    onClick={handleSecurityQuestionUpdate}
                    className="w-full bg-green-500 hover:bg-green-600 text-white"
                  >
                    <Shield className="w-4 h-4 mr-2" />
                    Actualizar seguridad
                  </Button>
                </div>
              )}
            </motion.div>
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4 text-sm text-gray-500 flex items-center justify-end"
              >
                <span>Siguiente: Pregunta de seguridad</span>
                <ChevronRight className="w-4 h-4 ml-1" />
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

