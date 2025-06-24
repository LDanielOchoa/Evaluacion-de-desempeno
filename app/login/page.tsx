"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { ArrowRight, LockKeyhole, User, ChevronRight } from "lucide-react"
import Image from "next/image"
import { toast } from "react-hot-toast"
import { NotFoundModal } from "@/components/NotFoundModal"
import { useUser } from "../contexts/userContexts"
import { ErrorMessage } from "@/components/ErrorMessage"
import { SecurityModal } from "@/components/SecurityModal"
import { ForgotPasswordModal } from "../../components/Security-Login/forgot-password-modal"
import { NoAccessModal } from "@/components/NotAccessModal"
import { AdminChoiceModal } from "@/components/AdminChoiceModal"

// Datos de ejemplo para visualización
const mockUserData = {
  CEDULA: 1234567890,
  NOMBRE: "Juan Carlos Pérez Rodríguez",
  CARGO: "ANALISTA DE DESARROLLO",
  CENTRO_DE_COSTO: "TECNOLOGÍA E INFORMÁTICA",
  LIDER_EVALUADOR: "María Elena González",
  CARGO_DE_LIDER_EVALUADOR: "COORDINADOR DE DESARROLLO",
  ESTADO: "ACTIVO",
  ANO_INGRESO: 2022,
  MES_INGRESO: "3",
  ANOS: 2,
  ANTIGUEDAD: "2 años 3 meses"
}

export default function LoginPage() {
  const router = useRouter()
  const { setUserData } = useUser()
  const [isLoading, setIsLoading] = useState(false)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isHovered, setIsHovered] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [showSecurityModal, setShowSecurityModal] = useState(false)
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [showNoAccessModal, setShowNoAccessModal] = useState(false)
  const [showAdminChoiceModal, setShowAdminChoiceModal] = useState(false)
  const [tempUserData, setTempUserData] = useState<any>(null)
  const [particles, setParticles] = useState<Array<{ x: number; y: number; size: number; color: string }>>([])

  useEffect(() => {
    const newParticles = Array.from({ length: 50 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 5 + 1,
      color: `hsl(${Math.random() * 60 + 100}, 70%, ${Math.random() * 20 + 70}%)`,
    }))
    setParticles(newParticles)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage("")

    if (!username || !password) {
      setErrorMessage("Por favor ingrese su usuario y contraseña")
      return
    }

    setIsLoading(true)
    
    // Simular delay de carga
    setTimeout(() => {
      try {
        // Usar datos de ejemplo para cualquier usuario/contraseña
        const userData = {
          ...mockUserData,
          CEDULA: parseInt(username) || mockUserData.CEDULA
        }

        setUserData(userData)
        toast.success(`Bienvenido, ${userData.NOMBRE}`)
        
        // Redirigir directamente al formulario
        router.push("/formulario")
        
      } catch (error: any) {
        console.error("Error:", error)
        setErrorMessage("Error al procesar el login")
      } finally {
        setIsLoading(false)
      }
    }, 1000)
  }

  const handleAdminChoice = (choice: "admin" | "default") => {
    setShowAdminChoiceModal(false)
    router.push(choice === "admin" ? "/admin" : "/formulario")
  }

  const floatingVariants = {
    animate: {
      y: [-10, 10, -10],
      transition: {
        duration: 5,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      },
    },
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-green-100 to-green-200 p-4 md:p-8 flex items-center justify-center relative overflow-hidden">
      {particles.map((particle, index) => (
        <motion.div
          key={index}
          className="absolute rounded-full"
          style={{
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
            x: particle.x,
            y: particle.y,
          }}
          animate={{
            x: [particle.x - 50, particle.x + 50, particle.x - 50],
            y: [particle.y - 50, particle.y + 50, particle.y - 50],
          }}
          transition={{
            duration: Math.random() * 10 + 20,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />
      ))}

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-5xl mx-auto bg-white/30 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden"
      >
        <div className="relative z-10 grid lg:grid-cols-2 h-full">
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="bg-white/40 p-6 md:p-12 flex flex-col justify-center relative order-2 lg:order-1"
          >
            <motion.div className="text-center lg:text-left mb-8 relative">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="flex items-center justify-center lg:justify-start mb-4"
              >
                <Image src="/sao6.png" alt="Company Logo" width={60} height={60} className="mr-4" />
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-green-500 to-green-700 bg-clip-text text-transparent">
                  Compromisos constructivos 2024
                </h1>
              </motion.div>
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="text-black text-lg md:text-xl relative z-10"
              >
                Ingrese su usario y contraseña para comenzar
              </motion.p>
            </motion.div>
            <ErrorMessage message={errorMessage} />
            <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto lg:mx-0">
              <motion.div className="space-y-4">
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.7, duration: 0.5 }}
                  className="relative group"
                >
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-green-600" />
                  <Input
                    type="text"
                    name="username"
                    placeholder="Ingrese su usuario"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="h-12 md:h-14 pl-12 rounded-2xl border-2 border-green-200 bg-white/60 backdrop-blur-sm focus:bg-white/80 focus:border-green-400 transition-all duration-300 relative z-10"
                  />
                </motion.div>
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                  className="relative group"
                >
                  <LockKeyhole className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-green-600" />
                  <Input
                    type="password"
                    name="password"
                    placeholder="Ingrese su contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12 md:h-14 pl-12 rounded-2xl border-2 border-green-200 bg-white/60 backdrop-blur-sm focus:bg-white/80 focus:border-green-400 transition-all duration-300 relative z-10"
                  />
                </motion.div>
              </motion.div>
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.9, duration: 0.5 }}
                className="flex justify-between items-center"
              >
                <motion.button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="text-sm text-green-600 hover:text-green-700 transition-colors flex items-center"
                  whileHover={{ x: 5 }}
                >
                  ¿Olvidaste tu contraseña?
                  <ChevronRight className="w-4 h-4 ml-1" />
                </motion.button>
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1, duration: 0.5 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="relative"
              >
                <motion.button
                  type="submit"
                  disabled={isLoading}
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                  className="w-full h-12 md:h-14 relative overflow-hidden rounded-2xl bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white text-base md:text-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
                  whileHover={{
                    scale: 1.05,
                    transition: { duration: 0.3, type: "spring", stiffness: 300 },
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-green-400 to-green-600"
                    style={{ borderRadius: "inherit" }}
                    animate={{
                      scale: [1, 1.05, 1],
                      rotate: [0, 1, -1, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "easeInOut",
                    }}
                  />
                  <AnimatePresence mode="wait">
                    {isLoading ? (
                      <motion.div
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 flex items-center justify-center"
                      >
                        <motion.div
                          className="w-6 h-6 border-4 border-white border-t-transparent rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                        />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="idle"
                        className="flex items-center justify-center gap-2 relative z-10"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <span>Ver Demo</span>
                        <motion.div
                          animate={
                            isHovered
                              ? {
                                  x: [0, 5, 0],
                                  rotate: [0, 10, 0],
                                }
                              : {}
                          }
                          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
                        >
                          <ArrowRight className="w-5 h-5" />
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
              </motion.div>
            </form>
          </motion.div>

          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="bg-white/40 relative order-1 lg:order-2 py-8 lg:py-0"
          >
            <motion.div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(circle at 50% 50%, rgba(74, 222, 128, 0.2) 0%, rgba(22, 163, 74, 0.1) 100%)",
                borderRadius: "50% 50% 50% 50% / 50% 50% 50% 50%",
              }}
              animate={{
                borderRadius: [
                  "50% 50% 50% 50% / 50% 50% 50% 50%",
                  "60% 40% 40% 60% / 60% 60% 40% 40%",
                  "50% 50% 50% 50% / 50% 50% 50% 50%",
                ],
              }}
              transition={{
                duration: 8,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            />
            <motion.div
              variants={floatingVariants}
              animate="animate"
              className="relative z-10 flex items-center justify-center h-full p-8 lg:p-12"
            >
              <Image
                src="/icon-login.png"
                alt="Performance Evaluation Illustration"
                width={500}
                height={500}
                className="w-full max-w-[200px] sm:max-w-[280px] lg:max-w-md h-auto drop-shadow-2xl"
                priority
              />
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
      <NotFoundModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <SecurityModal
        isOpen={showSecurityModal}
        onClose={() => setShowSecurityModal(false)}
        userData={tempUserData}
        onSecurityUpdate={(updatedData) => {
          setUserData(updatedData)
          toast.success("Seguridad actualizada con éxito")
          router.push("/formulario")
        }}
      />
      <ForgotPasswordModal isOpen={showForgotPassword} onClose={() => setShowForgotPassword(false)} />
      <AdminChoiceModal
        isOpen={showAdminChoiceModal}
        onClose={() => setShowAdminChoiceModal(false)}
        onChoice={handleAdminChoice}
      />
    </div>
  )
}

