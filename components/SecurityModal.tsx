"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Shield, Key, CheckCircle, AlertCircle, ChevronRight, Lock, Eye, EyeOff, Fingerprint } from "lucide-react"
import { SecurityQuestionSelector } from "./Security-Login/security-question-selector"
import { PasswordStrengthIndicator } from "./Security-Login/password-strength-indicator"

interface SecurityModalProps {
  isOpen: boolean
  onClose: () => void
  userData: any
  onSecurityUpdate: (updatedData: any) => void
}

export function SecurityModal({ isOpen, onClose, userData, onSecurityUpdate }: SecurityModalProps) {
  const [step, setStep] = useState(1)
  const [cedula, setCedula] = useState(userData?.cedula || "")
  const [oldPassword, setOldPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [securityQuestion, setSecurityQuestion] = useState("")
  const [securityAnswer, setSecurityAnswer] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)

  useEffect(() => {
    setPasswordStrength(calculatePasswordStrength(newPassword))
  }, [newPassword])

  const calculatePasswordStrength = (password: string) => {
    let strength = 0
    if (password.length >= 8) strength += 25
    if (password.match(/[a-z]/)) strength += 25
    if (password.match(/[A-Z]/)) strength += 25
    if (password.match(/\d/)) strength += 25
    return strength
  }

  const isPasswordValid = (password: string) => {
    return password.length >= 8 && /[a-zA-Z]/.test(password) && /\d/.test(password)
  }

  const handlePasswordChange = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      setError("Todos los campos son requeridos")
      return
    }

    if (!isPasswordValid(newPassword)) {
      setError("La contraseña debe tener al menos 8 caracteres y contener letras y números")
      return
    }

    if (newPassword !== confirmPassword) {
      setError("Las contraseñas no coinciden")
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch("https://evaluacion-de-desempeno.onrender.com/change_password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          CEDULA: Number(cedula),
          oldPassword: oldPassword,
          newPassword: newPassword,
          confirmPassword: confirmPassword,
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

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
      console.error("Error al cambiar la contraseña:", error)
      setError("Error al cambiar la contraseña: " + (error as any).message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSecurityQuestionUpdate = async (question: string, answer: string) => {
    setIsLoading(true)
    try {
      const response = await fetch("https://evaluacion-de-desempeno.onrender.com/update_security_question", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: cedula,
          securityQuestion: question,
          securityAnswer: answer,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setSuccess(data.message || "Pregunta de seguridad actualizada correctamente")
        setTimeout(() => {
          onSecurityUpdate({ ...userData, requiresSecurityUpdate: false })
          onClose()
        }, 2000)
      } else {
        setError(data.error || "Error al actualizar la pregunta de seguridad")
      }
    } catch (error) {
      console.error("Error al actualizar la pregunta de seguridad:", error)
      setError("Error al actualizar la pregunta de seguridad")
    } finally {
      setIsLoading(false)
    }
  }

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: "easeOut" } },
    exit: { opacity: 0, scale: 0.8, transition: { duration: 0.3, ease: "easeIn" } },
  }

  const contentVariants = {
    hidden: { x: 20, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 0.3 } },
    exit: { x: -20, opacity: 0, transition: { duration: 0.3 } },
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
          onClick={onClose}
        >
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="bg-white rounded-lg p-8 max-w-md w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <motion.div
              className="flex items-center mb-6"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Shield className="w-10 h-10 text-green-500 mr-3" />
              <h2 className="text-3xl font-bold text-green-700">Actualización de Seguridad</h2>
            </motion.div>
            <AnimatePresence mode="wait">
              <motion.div key={step} variants={contentVariants} initial="hidden" animate="visible" exit="exit">
                {step === 1 ? (
                  <div className="space-y-4">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      <Input
                        type="text"
                        placeholder="Cédula"
                        value={cedula}
                        onChange={(e) => setCedula(e.target.value)}
                        className="border-green-300 focus:ring-green-500 focus:border-green-500"
                        icon={<Fingerprint className="w-5 h-5 text-green-500" />}
                      />
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Contraseña actual"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        className="border-green-300 focus:ring-green-500 focus:border-green-500"
                        icon={
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="w-5 h-5 text-green-500 cursor-pointer" />
                            ) : (
                              <Eye className="w-5 h-5 text-green-500 cursor-pointer" />
                            )}
                          </motion.div>
                        }
                      />
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Nueva contraseña"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="border-green-300 focus:ring-green-500 focus:border-green-500"
                        icon={<Key className="w-5 h-5 text-green-500" />}
                      />
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Confirmar nueva contraseña"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="border-green-300 focus:ring-green-500 focus:border-green-500"
                        icon={<Key className="w-5 h-5 text-green-500" />}
                      />
                    </motion.div>
                    <PasswordStrengthIndicator strength={passwordStrength} />
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
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        onClick={handlePasswordChange}
                        className="w-full bg-green-500 hover:bg-green-600 text-white"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                          >
                            <Lock className="w-4 h-4 mr-2" />
                          </motion.div>
                        ) : (
                          <Key className="w-4 h-4 mr-2" />
                        )}
                        {isLoading ? "Cambiando..." : "Cambiar contraseña"}
                      </Button>
                    </motion.div>
                  </div>
                ) : (
                  <SecurityQuestionSelector onSubmit={handleSecurityQuestionUpdate} />
                )}
              </motion.div>
            </AnimatePresence>
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4 text-sm text-gray-500 flex items-center justify-end cursor-pointer"
                onClick={() => setStep(2)}
                whileHover={{ scale: 1.05 }}
              >
                <span>Siguiente: Pregunta de seguridad</span>
                <ChevronRight className="w-4 h-4 ml-1" />
              </motion.div>
            )}
            {step === 2 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4 text-sm text-gray-500 flex items-center justify-start cursor-pointer"
                onClick={() => setStep(1)}
                whileHover={{ scale: 1.05 }}
              >
                <ChevronRight className="w-4 h-4 mr-1 rotate-180" />
                <span>Volver: Cambio de contraseña</span>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

