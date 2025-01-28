"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { AlertCircle, ArrowLeft, CheckCircle, Key, Shield, User } from "lucide-react"

interface ForgotPasswordModalProps {
  isOpen: boolean
  onClose: () => void
}

type Step = "cedula" | "security" | "reset"

export function ForgotPasswordModal({ isOpen, onClose }: ForgotPasswordModalProps) {
  const [step, setStep] = useState<Step>("cedula")
  const [cedula, setCedula] = useState("")
  const [securityQuestion, setSecurityQuestion] = useState("")
  const [securityAnswer, setSecurityAnswer] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [attempts, setAttempts] = useState(0)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleVerifyCedula = async () => {
    if (!cedula) {
      setError("Por favor ingrese su cédula")
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch("https://evaluacion-de-desempeno.onrender.com/get_security_question", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: cedula }),
      })

      const data = await response.json()

      if (data.success) {
        setSecurityQuestion(data.securityQuestion)
        setStep("security")
        setError("")
      } else {
        setError(data.error || "Usuario no encontrado")
      }
    } catch (error) {
      setError("Error al verificar la cédula")
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifySecurityAnswer = async () => {
    if (!securityAnswer) {
      setError("Por favor ingrese su respuesta")
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch("https://evaluacion-de-desempeno.onrender.com/verify_security_answer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: cedula,
          securityAnswer: securityAnswer,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setStep("reset")
        setError("")
        setAttempts(0)
      } else {
        const newAttempts = attempts + 1
        setAttempts(newAttempts)

        if (newAttempts >= 3) {
          setError("Ha excedido el número máximo de intentos. Por favor contacte al administrador.")
          setTimeout(() => {
            onClose()
          }, 3000)
        } else {
          setError(`Respuesta incorrecta. Intentos restantes: ${3 - newAttempts}`)
        }
        setSecurityAnswer("")
      }
    } catch (error) {
      setError("Error al verificar la respuesta")
    } finally {
      setIsLoading(false)
    }
  }

  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      setError("Por favor complete todos los campos")
      return
    }

    if (newPassword !== confirmPassword) {
      setError("Las contraseñas no coinciden")
      return
    }

    if (newPassword.length < 8 || !/[a-zA-Z]/.test(newPassword) || !/\d/.test(newPassword)) {
      setError("La contraseña debe tener al menos 8 caracteres y contener letras y números")
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch("https://evaluacion-de-desempeno.onrender.com/reset_password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: cedula,
          newPassword: newPassword,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setSuccess("Contraseña actualizada correctamente")
        setTimeout(() => {
          onClose()
        }, 2000)
      } else {
        setError(data.error || "Error al actualizar la contraseña")
      }
    } catch (error) {
      setError("Error al actualizar la contraseña")
    } finally {
      setIsLoading(false)
    }
  }

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: "easeOut" } },
    exit: { opacity: 0, scale: 0.8, transition: { duration: 0.3, ease: "easeIn" } },
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
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
          <div className="flex items-center mb-6">
            <Shield className="w-8 h-8 text-green-500 mr-3" />
            <h2 className="text-2xl font-bold text-green-700">Recuperar Contraseña</h2>
          </div>

          <AnimatePresence mode="wait">
            {step === "cedula" && (
              <motion.div
                key="cedula"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Ingrese su cédula</label>
                  <Input
                    type="text"
                    value={cedula}
                    onChange={(e) => setCedula(e.target.value)}
                    className="border-green-300 focus:ring-green-500 focus:border-green-500"
                    icon={<User className="w-5 h-5 text-green-500" />}
                  />
                </div>
                <Button
                  onClick={handleVerifyCedula}
                  className="w-full bg-green-500 hover:bg-green-600 text-white"
                  disabled={isLoading}
                >
                  {isLoading ? "Verificando..." : "Continuar"}
                </Button>
              </motion.div>
            )}

            {step === "security" && (
              <motion.div
                key="security"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <Button
                  variant="ghost"
                  onClick={() => setStep("cedula")}
                  className="mb-4 text-green-600 hover:text-green-700"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Volver
                </Button>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">{securityQuestion}</label>
                  <Input
                    type="text"
                    value={securityAnswer}
                    onChange={(e) => setSecurityAnswer(e.target.value)}
                    className="border-green-300 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                <Button
                  onClick={handleVerifySecurityAnswer}
                  className="w-full bg-green-500 hover:bg-green-600 text-white"
                  disabled={isLoading}
                >
                  {isLoading ? "Verificando..." : "Verificar respuesta"}
                </Button>
              </motion.div>
            )}

            {step === "reset" && (
              <motion.div
                key="reset"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Nueva contraseña</label>
                  <Input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="border-green-300 focus:ring-green-500 focus:border-green-500"
                    icon={<Key className="w-5 h-5 text-green-500" />}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Confirmar contraseña</label>
                  <Input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="border-green-300 focus:ring-green-500 focus:border-green-500"
                    icon={<Key className="w-5 h-5 text-green-500" />}
                  />
                </div>
                <Button
                  onClick={handleResetPassword}
                  className="w-full bg-green-500 hover:bg-green-600 text-white"
                  disabled={isLoading}
                >
                  {isLoading ? "Actualizando..." : "Actualizar contraseña"}
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          {error && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-4 text-red-500 flex items-center"
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
              className="mt-4 text-green-500 flex items-center"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              {success}
            </motion.p>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

