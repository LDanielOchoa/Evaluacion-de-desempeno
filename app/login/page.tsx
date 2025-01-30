"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { ArrowRight, LockKeyhole, User, Shield, ChevronRight, Info } from "lucide-react"
import Image from "next/image"
import { toast } from "react-hot-toast"
import { NotFoundModal } from "@/components/NotFoundModal"
import { useUser } from "../contexts/userContexts"
import { ErrorMessage } from "@/components/ErrorMessage"
import { SecurityModal } from "@/components/SecurityModal"
import { ForgotPasswordModal } from "../../components/Security-Login/forgot-password-modal"

export default function LoginPage() {
  const router = useRouter()
  const { setUserData } = useUser()
  const [isLoading, setIsLoading] = useState(false)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isHovered, setIsHovered] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [showSecurityModal, setShowSecurityModal] = useState(false)
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [tempUserData, setTempUserData] = useState<{
    CEDULA: number
    NOMBRE: string
    CARGO: string
    CENTRO_DE_COSTO: string
    LIDER_EVALUADOR: string
    CARGO_DE_LIDER_EVALUADOR: string
    ESTADO: string
    ANO_INGRESO: number
    MES_INGRESO: number
    ANOS: number
    ANTIGUEDAD: number
  } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage("")

    if (!username || !password) {
      setErrorMessage("Por favor ingrese su usuario y contraseña")
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch("https://evaluacion-de-desempeno.onrender.com/validate_user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Error en la validación")
      }

      if (data.valid) {
        const userData = {
          CEDULA: Number.parseInt(username),
          NOMBRE: data.nombre,
          CARGO: data.cargo,
          CENTRO_DE_COSTO: data.centro_de_costo,
          LIDER_EVALUADOR: data.lider_evaluador,
          CARGO_DE_LIDER_EVALUADOR: data.cargo_de_lider_evaluador,
          ESTADO: data.estado,
          ANO_INGRESO: data.ano_ingreso,
          MES_INGRESO: data.mes_ingreso,
          ANOS: data.anos,
          ANTIGUEDAD: data.antiguedad,
        }

        if (data.requiresSecurityUpdate) {
          setTempUserData(userData)
          setShowSecurityModal(true)
        } else {
          setUserData(userData)
          toast.success(`Bienvenido, ${data.nombre}`)

          // Check if the user is a director or coordinator
          if (userData.CARGO.startsWith("DIRECTOR") || userData.CARGO.startsWith("COORDINADOR") || userData.CARGO.startsWith("PROFESIONAL DE DESARROLLO") || userData.CARGO.startsWith("PROFESIONAL DE PLENEACION Y PROGRAMACION") || userData.CARGO.startsWith("PROFESIONAL DE SISTEMAS DE GESTION INTEGRAL"))   {
            router.push("/post-login")
          } else {
            router.push("/formulario")
          }
        }
      } else {
        setErrorMessage("Usuario o contraseña incorrectos")
      }
    } catch (error: any) {
      console.error("Error:", error)
      setErrorMessage(error.message || "Error al validar el usuario")
    } finally {
      setIsLoading(false)
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  }

  const floatingVariants = {
    animate: {
      y: [0, -20, 0],
      transition: {
        duration: 4,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      },
    },
  }

  const generateCircles = (count: number) => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      size: Math.random() * (200 - 80) + 80,
      initialX: Math.random() * 100,
      initialY: Math.random() * 100,
      duration: Math.random() * 8 + 15,
      delay: Math.random() * 2,
      color: `hsl(${Math.random() * 60 + 100}, ${Math.random() * 30 + 70}%, ${Math.random() * 20 + 70}%)`,
    }))
  }

  const circles = generateCircles(30)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (e.target.name === "username") {
      setUsername(value)
    } else if (e.target.name === "password") {
      setPassword(value)
    }
    setIsAnimating(value.toLowerCase() === "use client")
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-green-100 to-green-200 p-4 md:p-8 flex items-center justify-center relative overflow-hidden">
      {circles.map((circle) => (
        <motion.div
          key={circle.id}
          className="absolute rounded-full mix-blend-multiply filter blur-md"
          style={{
            width: circle.size,
            height: circle.size,
            left: `${circle.initialX}%`,
            top: `${circle.initialY}%`,
            backgroundColor: circle.color,
          }}
          initial={{
            x: 0,
            y: 0,
            scale: 1,
            opacity: 0.4,
          }}
          animate={{
            x: [0, Math.random() * 50 - 25, 0],
            y: [0, Math.random() * 50 - 25, 0],
            scale: [1, 1.1, 1],
            opacity: [0.4, 0.6, 0.4],
          }}
          transition={{
            duration: circle.duration,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: circle.delay,
          }}
        />
      ))}

      <motion.div
        className="absolute top-0 left-0 w-[1000px] h-[1000px] rounded-full bg-green-300/10 filter blur-3xl"
        initial={{
          x: -300,
          y: -300,
          scale: 1,
        }}
        animate={{
          x: [-300, 0, -300],
          y: [-300, 0, -300],
          scale: [1, 1.2, 1],
        }}
        transition={{ duration: 15, repeat: Number.POSITIVE_INFINITY }}
      />
      <motion.div
        className="absolute bottom-0 right-0 w-[800px] h-[800px] rounded-full bg-green-400/10 filter blur-3xl"
        initial={{
          x: 300,
          y: 300,
          scale: 1.2,
        }}
        animate={{
          x: [300, 0, 300],
          y: [300, 0, 300],
          scale: [1.2, 1, 1.2],
        }}
        transition={{ duration: 12, repeat: Number.POSITIVE_INFINITY }}
      />

      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="w-full max-w-5xl mx-auto bg-white/30 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden"
      >
        <div className="relative z-10 grid lg:grid-cols-2 h-full">
          <motion.div
            variants={itemVariants}
            className="bg-white/40 p-6 md:p-12 flex flex-col justify-center relative order-2 lg:order-1"
          >
            <motion.div variants={itemVariants} className="text-center lg:text-left mb-8 relative">
              <motion.div
                className="absolute -top-20 -left-20 w-80 h-80 bg-green-300/20 rounded-full filter blur-3xl"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY }}
              />
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="flex items-center justify-center lg:justify-start mb-4"
              >
                <Image
                  src="/sao6.png"
                  alt="Company Logo"
                  width={60}
                  height={60}
                  className="mr-4"
                />
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-green-500 to-green-700 bg-clip-text text-transparent">
                  Compromisos constructivos 2024
                </h1>
              </motion.div>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="text-black text-lg md:text-xl relative z-10"
              >
                Ingrese su usuario y contraseña para comenzar
              </motion.p>
            </motion.div>
            <ErrorMessage message={errorMessage} />
            <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto lg:mx-0">
              <motion.div variants={itemVariants} className="space-y-4">
                <div className="relative group">
                  <motion.div whileHover={{ scale: 1.02 }} className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-green-300/20 to-green-500/20 rounded-2xl blur" />
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-black" />
                    <Input
                      type="text"
                      name="username"
                      placeholder="Ingrese su usuario"
                      value={username}
                      onChange={handleInputChange}
                      className="h-12 md:h-14 pl-12 rounded-2xl border-2 border-green-200 bg-white/60 backdrop-blur-sm focus:bg-white/80 focus:border-green-400 transition-all duration-300 relative z-10"
                    />
                  </motion.div>
                </div>
                <div className="relative group">
                  <motion.div whileHover={{ scale: 1.02 }} className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-green-300/20 to-green-500/20 rounded-2xl blur" />
                    <LockKeyhole className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-black" />
                    <Input
                      type="password"
                      name="password"
                      placeholder="Ingrese su contraseña"
                      value={password}
                      onChange={handleInputChange}
                      className="h-12 md:h-14 pl-12 rounded-2xl border-2 border-green-200 bg-white/60 backdrop-blur-sm focus:bg-white/80 focus:border-green-400 transition-all duration-300 relative z-10"
                    />
                  </motion.div>
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="flex justify-between items-center">
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
                variants={itemVariants}
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
                        <span>Iniciar Sesión</span>
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

          <motion.div variants={itemVariants} className="bg-white/40 relative order-1 lg:order-2 py-8 lg:py-0">
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
          router.push("/post-login")
        }}
      />
      <ForgotPasswordModal isOpen={showForgotPassword} onClose={() => setShowForgotPassword(false)} />
    </div>
  )
}

