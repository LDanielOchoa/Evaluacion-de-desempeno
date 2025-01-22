"use client"

import React, { useState, useEffect, useCallback, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Star,
  Send,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  X,
  Award,
  ThumbsUp,
  Frown,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import confetti from "canvas-confetti"
import { useUser } from "../contexts/userContexts"

type FormData = {
  historial: {}
  datos: {
    nombres: string
    cedula: string
    cargo: string
    jefe: string
    cargoJefe: string
    area: string
    antiguedad: string
    mesIngreso: string
    anoIngreso: string
  }
  valores: {
    compromiso: number
    honestidad: number
    respeto: number
    sencillez: number
    servicio: number
    trabajo_equipo: number
    conocimiento_trabajo: number
    productividad: number
    cumple_sistema_gestion: number
  }
  acuerdos: {
    colaborador_acuerdos: string
    jefe_acuerdos: string
    desarrollo_necesidades: string
    aspectos_positivos: string
  }
  [key: string]: any
}

type EvaluationHistory = {
  fecha_evaluacion: string
  anio: number
  cargo: string
  compromiso: number
  honestidad: number
  respeto: number
  sencillez: number
  servicio: number
  trabajo_equipo: number
  conocimiento_trabajo: number
  productividad: number
  cumple_sistema_gestion: number
  total_puntos: number
  porcentaje_calificacion: string
  acuerdos_mejora_desempeno_colaborador: string
  acuerdos_mejora_desempeno_jefe: string
  necesidades_desarrollo: string
  aspectos_positivos: string
}

const sections = ["historial", "datos", "valores", "acuerdos"]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.3 },
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

export default function CorporateEvaluationForm() {
  const router = useRouter()
  const { userData } = useUser()
  const [isLoading, setIsLoading] = useState(false)
  const [currentSection, setCurrentSection] = useState(0)
  const [showSuccess, setShowSuccess] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    historial: {},
    datos: {
      nombres: "",
      cedula: "",
      cargo: "",
      jefe: "",
      cargoJefe: "",
      area: "",
      antiguedad: "",
      mesIngreso: "",
      anoIngreso: "",
    },
    valores: {
      compromiso: 0,
      honestidad: 0,
      respeto: 0,
      sencillez: 0,
      servicio: 0,
      trabajo_equipo: 0,
      conocimiento_trabajo: 0,
      productividad: 0,
      cumple_sistema_gestion: 0,
    },
    acuerdos: {
      colaborador_acuerdos: "",
      jefe_acuerdos: "",
      desarrollo_necesidades: "",
      aspectos_positivos: "",
    },
  })
  const [evaluationHistory, setEvaluationHistory] = useState<EvaluationHistory[]>([])

  useEffect(() => {
    if (!userData) {
      router.push("/")
      return
    }

    setFormData((prev) => ({
      ...prev,
      datos: {
        ...prev.datos,
        nombres: userData.NOMBRE || "",
        cedula: userData.CEDULA?.toString() || "",
        cargo: userData.CARGO || "",
        jefe: userData.LIDER_EVALUADOR || "",
        cargoJefe: userData.CARGO_DE_LIDER_EVALUADOR || "",
        area: userData.CENTRO_DE_COSTO || "",
        antiguedad: userData.ANTIGUEDAD || "",
        mesIngreso: userData.MES_INGRESO || "",
        anoIngreso: userData.ANO_INGRESO?.toString() || "",
      },
    }))

    fetchEvaluationHistory(userData.CEDULA?.toString())
  }, [userData, router])

  const fetchEvaluationHistory = async (cedula: string) => {
    try {
      const response = await fetch("https://evaluacion-de-desempeno.onrender.com/get_evaluation_history", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cedula }),
      })

      if (!response.ok) {
        throw new Error("Error al obtener el historial de evaluaciones")
      }

      const data = await response.json()
      setEvaluationHistory(data.history)
    } catch (error) {
      console.error("Error:", error)
    }
  }

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      if (currentSection === sections.length - 1) {
        setIsLoading(true)
        try {
          const response = await fetch("https://evaluacion-de-desempeno.onrender.com/submit_evaluation", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              cedula: userData?.CEDULA,
              ...formData,
            }),
          })

          const data = await response.json()

          if (!response.ok) {
            throw new Error(data.error || "Error al enviar la evaluación")
          }

          setShowSuccess(true)
          if (calculateOverallRating() === 4) {
            confetti({
              particleCount: 100,
              spread: 70,
              origin: { y: 0.6 },
            })
          }
        } catch (error) {
          console.error("Error:", error)
          // Here you might want to show an error message to the user
        } finally {
          setIsLoading(false)
        }
      } else {
        setCurrentSection((prev) => prev + 1)
      }
    },
    [currentSection, formData, userData?.CEDULA],
  )

  const updateFormData = useCallback((section: string, field: string, value: number | string) => {
    setFormData((prev) => {
      const newData = {
        ...prev,
        [section]: {
          ...prev[section as keyof typeof prev],
          [field]: value,
        },
      }
      return newData
    })
  }, [])

  const calculateOverallRating = useCallback(() => {
    const values = Object.values(formData.valores) as number[]
    const sum = values.reduce((a, b) => a + b, 0)
    return sum / values.length
  }, [formData.valores])

  const RatingInput = React.memo(({ name, label, section }: { name: string; label: string; section: string }) => {
    const rating = formData[section as keyof typeof formData][name as keyof (typeof formData)[typeof section]] as number
    return (
      <motion.div
        variants={itemVariants}
        initial="hidden"
        animate="visible"
        className="mb-8 bg-gradient-to-br from-green-50/80 to-green-100/50 backdrop-blur-sm rounded-2xl p-4 sm:p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-white/50"
      >
        <Label htmlFor={name} className="block text-lg sm:text-xl font-medium text-green-900 mb-4 sm:mb-6">
          {label}
        </Label>
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center justify-between w-full sm:w-auto">
            <span className="text-xs sm:text-sm font-medium text-green-800 bg-green-100/50 px-2 sm:px-3 py-1 rounded-full">
              Malo
            </span>
            <span className="text-xs sm:text-sm font-medium text-green-800 bg-green-100/50 px-2 sm:px-3 py-1 rounded-full sm:hidden">
              Bueno
            </span>
          </div>
          <div className="flex gap-1 sm:gap-2 md:gap-4">
            {[1, 2, 3, 4].map((value) => (
              <motion.label
                key={value}
                className="cursor-pointer relative group"
              >
                <Input
                  type="radio"
                  name={name}
                  value={value}
                  className="sr-only"
                  onChange={() => updateFormData(section, name, value)}
                  checked={rating === value}
                />
                <Star
                  className={`w-8 h-8 sm:w-10 sm:h-10 transition-colors duration-200 ${
                    rating >= value ? "text-yellow-400" : "text-gray-600"
                  }`}
                  fill={rating >= value ? "currentColor" : "none"}
                  strokeWidth={1.5}
                />
                <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <span className="text-xs font-medium text-green-700 whitespace-nowrap bg-white/80 px-2 py-1 rounded-full shadow-sm">
                    {value}
                  </span>
                </div>
              </motion.label>
            ))}
          </div>
          <span className="hidden sm:inline-block text-xs sm:text-sm font-medium text-green-800 bg-green-100/50 px-2 sm:px-3 py-1 rounded-full">
            Bueno
          </span>
        </div>
      </motion.div>
    )
  })

  const TextInput = React.memo(
    ({
      id,
      label,
      required = false,
      disabled = false,
    }: {
      id: string
      label: string
      required?: boolean
      disabled?: boolean
    }) => (
      <motion.div variants={itemVariants} initial="hidden" animate="visible" className="mb-4">
        <Label htmlFor={id} className="block text-sm font-medium text-green-800 mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </Label>
        <Input
          type="text"
          id={id}
          name={id}
          required={required}
          disabled={disabled}
          className="w-full p-2 border-2 border-green-200 rounded-xl focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-200 bg-white/70 backdrop-blur-sm"
          value={formData.datos[id as keyof typeof formData.datos]}
          onChange={(e) => updateFormData("datos", id, e.target.value)}
        />
      </motion.div>
    ),
  )

  const TextAreaInput = React.memo(({ id, label }: { id: string; label: string }) => {
    const [localValue, setLocalValue] = useState(formData.acuerdos[id as keyof typeof formData.acuerdos])

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setLocalValue(e.target.value)
    }

    const handleBlur = useCallback(() => {
      updateFormData("acuerdos", id, localValue)
    }, [id, localValue])

    return (
      <motion.div
        layout
        variants={itemVariants}
        initial="hidden"
        animate="visible"
        className="bg-gradient-to-br from-white/60 to-white/30 backdrop-blur-sm rounded-2xl p-4 sm:p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-white/50"
      >
        <Label htmlFor={id} className="block text-xl font-medium text-green-800 mb-4">
          {label}
        </Label>
        <Textarea
          id={id}
          name={id}
          className="w-full p-4 border-2 border-green-200 rounded-xl focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-200 bg-white/70 backdrop-blur-sm resize-y"
          value={localValue}
          onChange={handleChange}
          onBlur={handleBlur}
          required
          rows={4}
          placeholder="Escribe aquí..."
        />
      </motion.div>
    )
  })

  const HistorySection = React.memo(() => {
    const [currentPage, setCurrentPage] = useState(0)
    const [expandedCard, setExpandedCard] = useState<number | null>(null)
    const evaluationsPerPage = 2

    const totalPages = Math.ceil(evaluationHistory.length / evaluationsPerPage)
    const paginatedEvaluations = evaluationHistory.slice(
      currentPage * evaluationsPerPage,
      (currentPage + 1) * evaluationsPerPage,
    )

    const nextPage = () => {
      setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))
      setExpandedCard(null)
    }

    const prevPage = () => {
      setCurrentPage((prev) => Math.max(prev - 1, 0))
      setExpandedCard(null)
    }

    const toggleExpand = (index: number) => {
      setExpandedCard(expandedCard === index ? null : index)
    }

    return (
      <motion.div
        variants={itemVariants}
        initial="hidden"
        animate="visible"
        className="bg-gradient-to-br from-white/60 to-white/30 backdrop-blur-sm rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-white/50"
      >
        <h2 className="text-2xl font-bold text-green-900 mb-8 flex items-center gap-3">
          <Sparkles className="w-6 h-6" />
          Historial de Evaluaciones
        </h2>
        {evaluationHistory.length === 0 ? (
          <p className="text-green-700">No hay evaluaciones previas.</p>
        ) : (
          <>
            <div className="space-y-6">
              {paginatedEvaluations.map((evaluation, index) => (
                <motion.div
                  key={index}
                  className="bg-white/50 rounded-xl shadow-md overflow-hidden"
                  initial={{ height: "auto" }}
                  animate={{ height: expandedCard === index ? "auto" : "120px" }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="p-6">
                    <div className="cursor-pointer" onClick={() => toggleExpand(index)}>
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold text-green-800">
                          Evaluación del {new Date(evaluation.fecha_evaluacion).toLocaleDateString()}
                        </h3>
                        <Button
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleExpand(index)
                          }}
                          variant="ghost"
                          size="sm"
                          className="text-green-600 hover:text-green-800"
                        >
                          {expandedCard === index ? (
                            <ChevronUp className="w-5 h-5" />
                          ) : (
                            <ChevronDown className="w-5 h-5" />
                          )}
                        </Button>
                      </div>
                      <p className="text-green-700 mt-2">Cargo: {evaluation.cargo}</p>
                      <p className="text-sm font-medium text-green-800 mt-2">
                        Calificación total: {evaluation.porcentaje_calificacion}
                      </p>
                    </div>
                    {expandedCard === index && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        className="mt-4"
                      >
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div>
                            <p className="text-sm text-green-600">Compromiso: {evaluation.compromiso}</p>
                            <p className="text-sm text-green-600">Honestidad: {evaluation.honestidad}</p>
                            <p className="text-sm text-green-600">Respeto: {evaluation.respeto}</p>
                            <p className="text-sm text-green-600">Sencillez: {evaluation.sencillez}</p>
                            <p className="text-sm text-green-600">Servicio: {evaluation.servicio}</p>
                          </div>
                          <div>
                            <p className="text-sm text-green-600">Trabajo en equipo: {evaluation.trabajo_equipo}</p>
                            <p className="text-sm text-green-600">
                              Conocimiento del trabajo: {evaluation.conocimiento_trabajo}
                            </p>
                            <p className="text-sm text-green-600">Productividad: {evaluation.productividad}</p>
                            <p className="text-sm text-green-600">
                              Cumplimiento del sistema de gestión: {evaluation.cumple_sistema_gestion}
                            </p>
                          </div>
                        </div>
                        <div className="space-y-2 mt-4">
                          <p className="text-sm text-green-700">
                            <strong>Acuerdos del colaborador:</strong>{" "}
                            {evaluation.acuerdos_mejora_desempeno_colaborador}
                          </p>
                          <p className="text-sm text-green-700">
                            <strong>Acuerdos del jefe:</strong> {evaluation.acuerdos_mejora_desempeno_jefe}
                          </p>
                          <p className="text-sm text-green-700">
                            <strong>Necesidades de desarrollo:</strong> {evaluation.necesidades_desarrollo}
                          </p>
                          <p className="text-sm text-green-700">
                            <strong>Aspectos positivos:</strong> {evaluation.aspectos_positivos}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="flex justify-between mt-6">
              <Button
                onClick={prevPage}
                disabled={currentPage === 0}
                className="px-4 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors duration-200 disabled:opacity-50"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <span className="text-green-800">
                Página {currentPage + 1} de {totalPages}
              </span>
              <Button
                onClick={nextPage}
                disabled={currentPage === totalPages - 1}
                className="px-4 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors duration-200 disabled:opacity-50"
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
          </>
        )}
      </motion.div>
    )
  })

  const AnimatedBackground = React.memo(() => (
    <div className="absolute inset-0 overflow-hidden">
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          className="rounded-full filter blur-xl opacity-10"
        />
      ))}
    </div>
  ))

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-green-50 via-mint-100 to-green-50 p-2 sm:p-4 md:p-8 flex items-center justify-center relative overflow-hidden">
      <AnimatedBackground />
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="w-full max-w-[95vw] sm:max-w-4xl mx-auto bg-green-50/30 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden border border-white/30"
      >
        <div className="p-4 sm:p-8 md:p-12">
          <motion.div variants={itemVariants} className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-green-900 mb-4">
              Evaluación de Desempeño
            </h1>
            <p className="text-green-700 text-lg md:text-xl">Por favor, complete todos los campos</p>
          </motion.div>

          {/* Progress bars */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 mb-8 sm:mb-12">
            {sections.map((section, index) => (
              <motion.div key={section} variants={itemVariants} className="relative">
                <div className="text-xs sm:text-sm font-medium text-green-800 mb-1 sm:mb-2">
                  {index === 0
                    ? "Historial"
                    : index === 1
                      ? "Datos Personales"
                      : index === 2
                        ? "Valores Corporativos"
                        : "Acuerdos y Desarrollo"}
                </div>
                <div className="h-2 sm:h-3 bg-white/30 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full ${
                      currentSection === index ? "bg-gradient-to-r from-teal-400 to-green-500" : "bg-gray-300"
                    }`}
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </motion.div>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <AnimatePresence mode="wait">
              {currentSection === 0 && (
                <motion.div
                  key="historial"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <HistorySection />
                </motion.div>
              )}
              {currentSection === 1 && (
                <motion.div
                  key="datos"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-2xl font-bold text-green-900 mb-8 flex items-center gap-3">
                    <Sparkles className="w-6 h-6" />
                    Datos Personales
                  </h2>
                  <div className="space-y-4">
                    <TextInput id="nombres" label="Nombres y Apellidos colaborador" required disabled />
                    <TextInput id="cedula" label="Cédula" required disabled />
                    <TextInput id="cargo" label="Cargo" required disabled />
                    <TextInput id="jefe" label="Nombre del jefe inmediato" required disabled />
                    <TextInput id="cargoJefe" label="Cargo del jefe inmediato" disabled />
                    <TextInput id="area" label="Área a la que pertenece" required disabled />
                  </div>
                </motion.div>
              )}

              {currentSection === 2 && (
                <motion.div
                  key="valores"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-2xl font-bold text-green-900 mb-8 flex items-center gap-3">
                    <Sparkles className="w-6 h-6" />
                    Valores Corporativos
                  </h2>
                  <div className="space-y-8">
                    <RatingInput
                      name="compromiso"
                      label="Compromiso: Pasión y entrega en lo que hago"
                      section="valores"
                    />
                    <RatingInput
                      name="honestidad"
                      label="Honestidad: Hacer lo correcto sin necesidad de espectadores"
                      section="valores"
                    />
                    <RatingInput
                      name="respeto"
                      label="Respeto: Reconocer y aceptar los derechos de los demás"
                      section="valores"
                    />
                    <RatingInput
                      name="sencillez"
                      label="Sencillez: Humildad y valorar todo por simple que parezca"
                      section="valores"
                    />
                    <RatingInput name="servicio" label="Servicio: Atención al cliente y compañeros" section="valores" />
                    <RatingInput
                      name="trabajo_equipo"
                      label="Trabajo en equipo: Colaboración y apoyo mutuo"
                      section="valores"
                    />
                    <RatingInput
                      name="conocimiento_trabajo"
                      label="Conocimiento del trabajo: Experiencia y habilidades"
                      section="valores"
                    />
                    <RatingInput
                      name="productividad"
                      label="Productividad: Eficiencia y resultados"
                      section="valores"
                    />
                    <RatingInput
                      name="cumple_sistema_gestion"
                      label="Cumplimiento del sistema de gestión: Normas y procedimientos"
                      section="valores"
                    />
                  </div>
                </motion.div>
              )}
              {currentSection === 3 && (
                <motion.div
                  key="acuerdos"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }} // Añadido animate
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }} // Añadido transition
                  className="space-y-8"
                >
                  <h2 className="text-2xl font-bold text-green-900 mb-8 flex items-center gap-3">
                    <Sparkles className="w-6 h-6" />
                    Acuerdos y Desarrollo
                  </h2>
                  <TextAreaInput
                    id="colaborador_acuerdos"
                    label="Acuerdos para mejorar el desempeño por parte del colaborador:"
                  />
                  <TextAreaInput
                    id="jefe_acuerdos"
                    label="Acuerdos para mejorar el desempeño por parte del jefe inmediato:"
                  />
                  <TextAreaInput
                    id="desarrollo_necesidades"
                    label="Necesidades de desarrollo del cargo (Formación, entrenamiento, mentoría, etc.):"
                  />
                  <TextAreaInput
                    id="aspectos_positivos"
                    label="Aspectos positivos a resaltar del colaborador por parte del jefe inmediato:"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0 pt-8"
            >
              <Button
                type="button"
                onClick={() => setCurrentSection((prev) => Math.max(0, prev - 1))}
                disabled={currentSection === 0}
                className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:hover:shadow-none"
              >
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" /> Anterior
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <motion.div
                    className="w-5 h-5 sm:w-6 sm:h-6 border-3 border-white border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                  />
                ) : (
                  <>
                    <span>{currentSection === sections.length - 1 ? "Enviar" : "Siguiente"}</span>
                    {currentSection === sections.length - 1 ? (
                      <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                    ) : (
                      <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                    )}
                  </>
                )}
              </Button>
            </motion.div>
          </form>
        </div>
      </motion.div>

      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-8 max-w-lg w-full relative"
            >
              <button
                onClick={() => setShowSuccess(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors duration-200"
              >
                <X className="w-6 h-6" />
              </button>
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  className="w-20 h-20 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                  {calculateOverallRating() >= 3 ? (
                    <Award className="w-10 h-10 text-green-600" />
                  ) : calculateOverallRating() >= 2 ? (
                    <ThumbsUp className="w-10 h-10 text-yellow-600" />
                  ) : (
                    <Frown className="w-10 h-10 text-red-600" />
                  )}
                </motion.div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">¡Evaluación Enviada con Éxito!</h3>
                <motion.p
                  className="text-gray-600 mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  {calculateOverallRating() >= 3
                    ? "¡Excelente trabajo! Tu compromiso con nuestros valores corporativos es ejemplar. Sigue así, eres un pilar fundamental para nuestro equipo."
                    : calculateOverallRating() >= 2
                      ? "Buen trabajo. Has demostrado un sólido entendimiento de nuestros valores corporativos. Hay espacio para crecer, ¡y estamos aquí para apoyarte!"
                      : "Gracias por completar la evaluación. Vemos oportunidades para mejorar en la alineación con nuestros valores corporativos. ¡Trabajemos juntos para tu desarrollo!"}
                </motion.p>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
                  <p className="text-sm text-gray-500 mb-4">
                    Tu evaluación ha sido registrada y será revisada por tu supervisor. Pronto recibirás más información
                    sobre los próximos pasos.
                  </p>
                  <Button
                    onClick={() => setShowSuccess(false)}
                    className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full hover:shadow-lg transition-all duration-200"
                  >
                    Entendido
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

