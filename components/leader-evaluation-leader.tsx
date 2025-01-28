"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useUser } from "../app/contexts/userContexts"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowRight, AlertCircle, Calendar, CheckCircle } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface Employee {
  cedula: string
  nombre: string
  cargo: string
  centro_de_costo: string
  lider_evaluador: string
  cargo_de_lider_evaluador: string
  ultima_evaluacion: string
  evaluado_este_ano: boolean
}

interface ServerResponse {
  success: boolean
  employees: Employee[]
  message?: string
  error?: string
}

export function LeaderEvaluationView() {
  const router = useRouter()
  const { userData } = useUser()
  const { toast } = useToast()
  const [evaluations, setEvaluations] = useState<Employee[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    if (userData?.CEDULA) {
      fetchEvaluations(userData.CEDULA.toString())
    }
  }, [userData])

  const fetchEvaluations = async (leaderId: string) => {
    setLoading(true)
    setError("")
    try {
      const response = await fetch(`https://evaluacion-de-desempeno.onrender.com/get_employees_under_leader?cedula=${leaderId}&year=2025`)
      const data: ServerResponse = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Error al obtener los empleados")
      }

      if (data.success) {
        setEvaluations(data.employees)
        if (data.employees.length === 0) {
          toast({
            description: "No se encontraron empleados para este líder",
          })
        }
      } else {
        throw new Error(data.error || "Error desconocido")
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Error al cargar los empleados"
      setError(message)
      toast({
        variant: "destructive",
        title: "Error",
        description: message,
      })
    } finally {
      setLoading(false)
    }
  }

  const filteredEvaluations = evaluations.filter((employee) => {
    const searchLower = searchTerm.toLowerCase()
    return (
      employee.nombre.toLowerCase().includes(searchLower) ||
      employee.cargo.toLowerCase().includes(searchLower) ||
      employee.cedula.includes(searchTerm)
    )
  })

  const handleStartEvaluation = async (cedula: string) => {
    try {
      const response = await fetch(`https://evaluacion-de-desempeno.onrender.com/get_user_details?cedula=${cedula}`)
      if (!response.ok) {
        throw new Error("Error al obtener los detalles del usuario")
      }
      const userDetails = await response.json()

      const formData = {
        historial: {},
        datos: {
          nombres: userDetails.nombre || "",
          cedula: userDetails.cedula || "",
          cargo: userDetails.cargo || "",
          jefe: userDetails.lider_evaluador || "",
          cargoJefe: userDetails.cargo_de_lider_evaluador || "",
          area: userDetails.centro_de_costo || "",
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
      }

      router.push(`/formulario?formData=${encodeURIComponent(JSON.stringify(formData))}`)
    } catch (error) {
      console.error("Error al iniciar la evaluación:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo iniciar la evaluación. Por favor, intente nuevamente.",
      })
    }
  }

  if (!isClient) {
    return null
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-green-50 to-green-100 p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-7xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden"
      >
        <div className="relative z-10 p-6 md:p-12">
          <header className="text-center mb-12">
            <div className="flex items-center justify-center mb-6">
              <Image src="/sao6.png" alt="Company Logo" width={100} height={100} className="mr-4" />
              <h1 className="text-4xl md:text-5xl font-bold text-green-700">Gestión de Evaluaciones</h1>
            </div>
            <p className="text-gray-600 text-xl md:text-2xl">
              Bienvenido, <span className="font-semibold text-green-600">{userData?.NOMBRE}</span>
            </p>
          </header>

          <div className="space-y-4">
            {loading ? (
              <SkeletonLoader />
            ) : error ? (
              <ErrorMessage message={error} />
            ) : (
              <div className="overflow-x-auto">
                {evaluations.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-green-100">
                        <TableHead className="font-bold text-green-800">Nombre</TableHead>
                        <TableHead className="font-bold text-green-800">Cédula</TableHead>
                        <TableHead className="font-bold text-green-800">Cargo</TableHead>
                        <TableHead className="font-bold text-green-800">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <AnimatePresence>
                        {filteredEvaluations.map((employee, index) => (
                          <motion.tr
                            key={employee.cedula}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                            className="hover:bg-green-50 transition-colors duration-150"
                          >
                            <TableCell className="font-medium">{employee.nombre}</TableCell>
                            <TableCell>{employee.cedula}</TableCell>
                            <TableCell>{employee.cargo}</TableCell>
                            <TableCell>
                              {employee.evaluado_este_ano ? (
                                <div className="flex items-center text-green-600">
                                  <CheckCircle className="mr-2 h-5 w-5" />
                                  Ya evaluado
                                </div>
                              ) : (
                                <Button
                                  onClick={() => handleStartEvaluation(employee.cedula)}
                                  className="bg-green-500 hover:bg-green-600 text-white transition-colors duration-150"
                                >
                                  Iniciar Evaluación
                                  <ArrowRight className="ml-2" size={16} />
                                </Button>
                              )}
                            </TableCell>
                          </motion.tr>
                        ))}
                      </AnimatePresence>
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8 text-gray-500">No se encontraron empleados para este líder</div>
                )}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  )
}

const SkeletonLoader = () => (
  <div className="space-y-4">
    {[...Array(5)].map((_, i) => (
      <div key={i} className="flex space-x-4">
        <div className="w-1/5 h-8 bg-green-100 rounded animate-pulse"></div>
        <div className="w-1/5 h-8 bg-green-100 rounded animate-pulse"></div>
        <div className="w-1/5 h-8 bg-green-100 rounded animate-pulse"></div>
        <div className="w-1/5 h-8 bg-green-100 rounded animate-pulse"></div>
        <div className="w-1/5 h-8 bg-green-100 rounded animate-pulse"></div>
      </div>
    ))}
  </div>
)

interface ErrorMessageProps {
  message: string
}

const ErrorMessage = ({ message }: ErrorMessageProps) => (
  <div className="text-center py-8">
    <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
    <p className="text-xl text-red-600 font-semibold">{message}</p>
  </div>
)

