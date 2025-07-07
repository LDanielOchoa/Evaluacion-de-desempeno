"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useUser } from "../app/contexts/userContexts"
import {
  ArrowRight,
  Search,
  Calendar,
  User,
  Briefcase,
  Star,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react"
import { DetailModal } from "./DetailModal"

interface HistorialItem {
  id: string
  nombre: string
  cargo: string
  fecha: string
  accion: string
  puntaje_total: number
  porcentaje_calificacion: number
  detalles: {
    compromiso: number
    honestidad: number
    respeto: number
    sencillez: number
    servicio: number
    trabajo_equipo: number
    conocimiento_trabajo: number
    productividad: number
    cumple_sistema_gestion: number
    acuerdos_mejora_desempeno_colaborador: string
    acuerdos_mejora_desempeno_jefe: string
    necesidades_desarrollo: string
    aspectos_positivos: string
  }
}

interface GroupedHistorial {
  [key: string]: HistorialItem[]
}

interface CurrentIndexes {
  [key: string]: number
}

export function EnhancedHistoryView() {
  const router = useRouter()
  const { userData } = useUser()
  const [historial, setHistorial] = useState<HistorialItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [isHovered, setIsHovered] = useState(false)
  const [selectedItem, setSelectedItem] = useState<HistorialItem | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [groupedHistorial, setGroupedHistorial] = useState<GroupedHistorial>({})
  const [currentIndexes, setCurrentIndexes] = useState<CurrentIndexes>({})

  useEffect(() => {
    fetchHistorial()
  }, [])

  useEffect(() => {
    if (historial.length > 0) {
      const grouped = historial.reduce<GroupedHistorial>((acc, item) => {
        if (!acc[item.nombre]) {
          acc[item.nombre] = []
        }
        acc[item.nombre].push(item)
        return acc
      }, {})
      setGroupedHistorial(grouped)
      setCurrentIndexes(
        Object.keys(grouped).reduce<CurrentIndexes>((acc, name) => {
          acc[name] = 0
          return acc
        }, {}),
      )
    }
  }, [historial])

  const fetchHistorial = async () => {
    if (!userData?.CEDULA) return
    
    setLoading(true)
    try {
      // Cargar datos de evaluaciones y usuarios
      const [evaluacionesResponse, usuariosResponse] = await Promise.all([
        fetch('/data.json'),
        fetch('/usuarios_data.json')
      ])
      
      const evaluaciones = await evaluacionesResponse.json()
      const usuarios = await usuariosResponse.json()
      
      // Encontrar el usuario actual
      const usuario = usuarios.find((u: any) => u.CEDULA === userData.CEDULA)
      if (!usuario) {
        throw new Error("Usuario no encontrado")
      }
      
      // Filtrar evaluaciones por cédula
      const evaluacionesUsuario = evaluaciones
        .filter((evaluacion: any) => evaluacion.cedula === userData.CEDULA)
      
      // Obtener el año más reciente de las evaluaciones del usuario
      const añosDisponibles = [...new Set(evaluacionesUsuario.map((evaluacion: any) => 
        evaluacion.anio || new Date(evaluacion.fecha_evaluacion).getFullYear()
      ))]
      const añoMásReciente = Math.max(...añosDisponibles.map(Number))
      
      // Filtrar solo las evaluaciones del año más reciente
      const evaluacionesDelÚltimoAño = evaluacionesUsuario.filter((evaluacion: any) => {
        const añoEvaluacion = evaluacion.anio || new Date(evaluacion.fecha_evaluacion).getFullYear()
        return añoEvaluacion === añoMásReciente
      })
      
      // Formatear las evaluaciones del último año
      const evaluacionesFormateadas = evaluacionesDelÚltimoAño.map((evaluacion: any) => ({
        id: evaluacion.id || Math.random().toString(36).substr(2, 9),
        nombre: evaluacion.nombres_apellidos || usuario.NOMBRE,
        cargo: evaluacion.cargo || usuario.CARGO,
        fecha: evaluacion.fecha_evaluacion || new Date().toISOString().split('T')[0],
        accion: "Evaluación de Desempeño",
        puntaje_total: evaluacion.total_puntos || 0,
        porcentaje_calificacion: parseFloat(evaluacion.porcentaje_calificacion) || 0,
        detalles: {
          compromiso: evaluacion.compromiso_pasion_entrega || 0,
          honestidad: evaluacion.honestidad || 0,
          respeto: evaluacion.respeto || 0,
          sencillez: evaluacion.sencillez || 0,
          servicio: evaluacion.servicio || 0,
          trabajo_equipo: evaluacion.trabajo_equipo || 0,
          conocimiento_trabajo: evaluacion.conocimiento_trabajo || 0,
          productividad: evaluacion.productividad || 0,
          cumple_sistema_gestion: evaluacion.cumple_sistema_gestion || 0,
          acuerdos_mejora_desempeno_colaborador: evaluacion.acuerdos_mejora_desempeno_colaborador || "",
          acuerdos_mejora_desempeno_jefe: evaluacion.acuerdos_mejora_desempeno_jefe || "",
          necesidades_desarrollo: evaluacion.necesidades_desarrollo || "",
          aspectos_positivos: evaluacion.aspectos_positivos || ""
        }
      }))
      
      setHistorial(evaluacionesFormateadas)
    } catch (error) {
      setError("Error al cargar el historial")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const filteredHistorial = Object.entries(groupedHistorial).filter(
    ([name, items]: [string, HistorialItem[]]) =>
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      items.some((item) => item.cargo.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const handlePrev = (name: string) => {
    setCurrentIndexes((prev: CurrentIndexes) => {
      const currentIndex = prev[name] || 0
      const items = groupedHistorial[name] || []
      return {
        ...prev,
        [name]: (currentIndex - 1 + items.length) % items.length,
      }
    })
  }

  const handleNext = (name: string) => {
    setCurrentIndexes((prev: CurrentIndexes) => {
      const currentIndex = prev[name] || 0
      const items = groupedHistorial[name] || []
      return {
        ...prev,
        [name]: (currentIndex + 1) % items.length,
      }
    })
  }

  const getStatusColor = (porcentaje: number) => {
    if (porcentaje >= 90) return "text-green-500"
    if (porcentaje >= 70) return "text-yellow-500"
    return "text-red-500"
  }

  const getStatusIcon = (porcentaje: number) => {
    if (porcentaje >= 90) return <CheckCircle className="h-5 w-5" />
    if (porcentaje >= 70) return <AlertCircle className="h-5 w-5" />
    return <XCircle className="h-5 w-5" />
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-green-100 to-green-200 p-4 md:p-8 flex items-center justify-center relative overflow-hidden">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.1,
              delayChildren: 0.3,
            },
          },
        }}
        className="w-full max-w-5xl mx-auto bg-white/70 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden"
      >
        <div className="relative z-10 p-6 md:p-12">
          <motion.div
            variants={{
              hidden: { opacity: 0, y: -20 },
              visible: { opacity: 1, y: 0 },
            }}
            className="text-center mb-8 relative"
          >
            <div className="flex items-center justify-center mb-4">
              <Image src="/sao6.png" alt="Company Logo" width={80} height={80} className="mr-4" />
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent">
                Historial de Evaluaciones
              </h1>
            </div>
            <p className="text-black text-xl md:text-2xl relative z-10">
              Bienvenido, <span className="font-semibold">{userData?.NOMBRE}</span>
            </p>
          </motion.div>

          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            className="mb-8"
          >
            <div className="relative group">
              <motion.div whileHover={{ scale: 1.02 }} className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-green-300/20 to-green-500/20 rounded-2xl blur" />
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-green-600" />
                <Input
                  type="text"
                  placeholder="Buscar por nombre o cargo"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="h-14 pl-12 rounded-2xl border-2 border-green-200 bg-white/80 backdrop-blur-sm focus:bg-white focus:border-green-400 transition-all duration-300 relative z-10 text-lg"
                />
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1 },
            }}
            className="space-y-6"
          >
            {loading ? (
              <div className="text-center text-2xl text-green-700">Cargando...</div>
            ) : error ? (
              <div className="text-center text-2xl text-red-600">{error}</div>
            ) : (
              filteredHistorial.map(([name, items]: [string, any[]]) => (
                <motion.div
                  key={name}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-2xl text-green-800">{name}</h3>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handlePrev(name)}
                        aria-label="Evaluación anterior"
                        className="bg-green-100 hover:bg-green-200 text-green-700"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </Button>
                      <span className="text-lg font-medium text-green-700">
                        {currentIndexes[name] + 1} / {items.length}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleNext(name)}
                        aria-label="Evaluación siguiente"
                        className="bg-green-100 hover:bg-green-200 text-green-700"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentIndexes[name]}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3 }}
                      className="bg-green-50 rounded-xl p-4"
                    >
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="flex items-center space-x-2">
                          <Briefcase className="h-5 w-5 text-green-600" />
                          <span className="text-green-700 font-medium">{items[currentIndexes[name]].cargo}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-5 w-5 text-green-600" />
                          <span className="text-green-700">
                            {new Date(items[currentIndexes[name]].fecha).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between bg-white rounded-lg p-3">
                        <div className="flex items-center space-x-2">
                          <Star className="h-5 w-5 text-yellow-500" />
                          <span className="text-lg font-semibold">
                            {items[currentIndexes[name]].puntaje_total} puntos
                          </span>
                        </div>
                        <div
                          className={`flex items-center space-x-2 ${getStatusColor(items[currentIndexes[name]].porcentaje_calificacion)}`}
                        >
                          {getStatusIcon(items[currentIndexes[name]].porcentaje_calificacion)}
                          <span className="font-medium">{items[currentIndexes[name]].porcentaje_calificacion}%</span>
                        </div>
                      </div>
                      <Button
                        className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white"
                        onClick={() => {
                          setSelectedItem(items[currentIndexes[name]])
                          setIsModalOpen(true)
                        }}
                      >
                        Ver detalles
                      </Button>
                    </motion.div>
                  </AnimatePresence>
                </motion.div>
              ))
            )}
          </motion.div>

          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            className="mt-12 flex justify-center"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="relative">
              <Button
                onClick={() => router.push("/formulario")}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="h-16 px-10 relative overflow-hidden rounded-2xl bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white text-xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
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
                <motion.div
                  className="flex items-center justify-center gap-3 relative z-10"
                  animate={
                    isHovered
                      ? {
                          x: [0, 5, 0],
                        }
                      : {}
                  }
                  transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
                >
                  <span>Realizar Formulario</span>
                  <ArrowRight className="w-6 h-6" />
                </motion.div>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
      <DetailModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} item={selectedItem} />
    </div>
  )
}

