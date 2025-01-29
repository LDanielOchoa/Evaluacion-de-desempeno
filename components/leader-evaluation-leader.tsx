"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useUser } from "../app/contexts/userContexts"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowRight, AlertCircle, CheckCircle, BarChart2, Search, User, ChevronLeft, ChevronRight } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  Cell,
} from "recharts"
import { IndicatorDetails } from "./indicator-details"

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

interface EmployeeStats {
  anios: number[]
  resultados: {
    [key: string]: {
      total_puntos: number
      porcentaje_calificacion: string
      compromiso: number
      honestidad: number
      respeto: number
      sencillez: number
      servicio: number
      trabajo_en_equipo: number
      conocimiento: number
      productividad: number
      gestion: number
    }
  }
}

interface ServerResponse {
  success: boolean
  employees: Employee[]
  message?: string
  error?: string
}

const CHART_COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#a4de6c"]

export function LeaderEvaluationView() {
  const router = useRouter()
  const { userData } = useUser()
  const { toast } = useToast()
  const [evaluations, setEvaluations] = useState<Employee[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [isClient, setIsClient] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)
  const [employeeStats, setEmployeeStats] = useState<EmployeeStats | null>(null)
  const [loadingStats, setLoadingStats] = useState(false)
  const [currentChartIndex, setCurrentChartIndex] = useState(0)
  const chartContainerRef = useRef<HTMLDivElement>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [selectedIndicator, setSelectedIndicator] = useState<any>(null)

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
      const response = await fetch(
        `https://evaluacion-de-desempeno.onrender.com/get_employees_under_leader?cedula=${leaderId}&year=2025`,
      )
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

  const fetchEmployeeStats = async (cedula: string) => {
    setLoadingStats(true)
    try {
      setEmployeeStats(null)
      const response = await fetch(`https://evaluacion-de-desempeno.onrender.com/get_employee_stats?cedula=${cedula}`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      if (data.error) {
        throw new Error(data.error)
      }
      setEmployeeStats(data)
    } catch (error) {
      console.error("Error al obtener las estadísticas:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudieron obtener las estadísticas del empleado. Por favor, intente nuevamente.",
      })
      setEmployeeStats(null)
    } finally {
      setLoadingStats(false)
    }
  }

  const handleViewStats = (employee: Employee) => {
    setSelectedEmployee(employee)
    fetchEmployeeStats(employee.cedula)
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
          trabajo_en_equipo: 0,
          conocimiento: 0,
          productividad: 0,
          gestion: 0,
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

  const charts = [
    { title: "Porcentaje de Calificación", type: "bar", render: renderQualificationBar },
    { title: "Cumplimiento por Área", type: "bar", render: renderComplianceBar },
    { title: "Progreso a lo largo de los años", type: "line", render: renderProgressLineChart },
  ];

  const nextChart = () => {
    setCurrentChartIndex((prevIndex) => (prevIndex + 1) % charts.length)
  }

  const prevChart = () => {
    setCurrentChartIndex((prevIndex) => (prevIndex - 1 + charts.length) % charts.length)
  }

  const handleDoubleClick = (data: any) => {
    setSelectedIndicator(data)
    setDetailsOpen(true)
  }

  function renderQualificationBar() {
    if (!employeeStats) return null

    const data = employeeStats.anios.map((anio, index) => ({
      anio,
      porcentaje: Number.parseFloat(employeeStats.resultados[anio].porcentaje_calificacion),
      color: CHART_COLORS[index % CHART_COLORS.length],
    }))

    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Porcentaje de Calificación por Año</CardTitle>
        </CardHeader>
        <CardContent className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="anio" />
              <YAxis domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
              <Tooltip
                formatter={(value: number) => [`${value.toFixed(2)}%`, "Porcentaje de Calificación"]}
                labelFormatter={(label) => `Año: ${label}`}
              />
              <Legend />
              <Bar dataKey="porcentaje" name="Porcentaje de Calificación" onDoubleClick={handleDoubleClick}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    )
  }

  function renderComplianceBar() {
    if (!employeeStats) return null

    const areas = [
      "Compromiso",
      "Honestidad",
      "Respeto",
      "Sencillez",
      "Servicio",
      "Trabajo en Equipo",
      "Conocimiento",
      "Productividad",
      "Gestion",
    ]

    const data = areas.map((area) => {
      const dataPoint: { [key: string]: string | number } = { area }
      employeeStats.anios.forEach((anio) => {
        const key = area.toLowerCase().replace(/ /g, "_")
        dataPoint[anio.toString()] =
          employeeStats.resultados[anio][key as keyof (typeof employeeStats.resultados)[typeof anio]]
      })
      return dataPoint
    })

    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Cumplimiento por Área y Año</CardTitle>
        </CardHeader>
        <CardContent className="h-[500px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              onDoubleClick={handleDoubleClick}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="area" angle={-45} textAnchor="end" interval={0} height={100} />
              <YAxis domain={[0, 10]} />
              <Tooltip
                formatter={(value: number, name: string) => [`${value.toFixed(2)}`, `Año ${name}`]}
                labelFormatter={(label) => `Área: ${label}`}
              />
              <Legend />
              {employeeStats.anios.map((anio, index) => (
                <Bar
                  key={anio}
                  dataKey={anio.toString()}
                  fill={CHART_COLORS[index % CHART_COLORS.length]}
                  name={`Año ${anio}`}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    )
  }

  function renderProgressLineChart() {
    if (!employeeStats) return null

    const data = employeeStats.anios.map((anio) => ({
      anio,
      puntos: employeeStats.resultados[anio].total_puntos,
      porcentaje: Number.parseFloat(employeeStats.resultados[anio].porcentaje_calificacion),
    }))

    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Progreso a lo largo de los años</CardTitle>
          <CardDescription>Puntos totales y porcentaje de calificación</CardDescription>
        </CardHeader>
        <CardContent className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              onDoubleClick={handleDoubleClick}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="anio" />
              <YAxis yAxisId="left" orientation="left" stroke={CHART_COLORS[0]} />
              <YAxis
                yAxisId="right"
                orientation="right"
                stroke={CHART_COLORS[1]}
                domain={[0, 100]}
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip
                formatter={(value: number, name: string) => [
                  name === "puntos" ? value.toFixed(2) : `${value.toFixed(2)}%`,
                  name === "puntos" ? "Puntos Totales" : "Porcentaje de Calificación",
                ]}
                labelFormatter={(label) => `Año: ${label}`}
              />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="puntos" stroke={CHART_COLORS[0]} name="Puntos Totales" />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="porcentaje"
                stroke={CHART_COLORS[1]}
                name="Porcentaje de Calificación"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    )
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
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="flex items-center justify-center mb-6"
            >
              <Image src="/sao6.png" alt="Company Logo" width={100} height={100} className="mr-4" priority />
              <h1 className="text-4xl md:text-5xl font-bold text-green-700">Gestión de Evaluaciones</h1>
            </motion.div>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-gray-600 text-xl md:text-2xl"
            >
              Bienvenido, <span className="font-semibold text-green-600">{userData?.NOMBRE}</span>
            </motion.p>
          </header>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="mb-6"
          >
            <div className="relative">
              <Input
                type="text"
                placeholder="Buscar por nombre, cédula o cargo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            </div>
          </motion.div>

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
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                            className="hover:bg-green-50 transition-colors duration-150"
                          >
                            <TableCell className="font-medium">{employee.nombre}</TableCell>
                            <TableCell>{employee.cedula}</TableCell>
                            <TableCell>{employee.cargo}</TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
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
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button
                                      onClick={() => handleViewStats(employee)}
                                      className="bg-blue-500 hover:bg-blue-600 text-white transition-colors duration-150"
                                    >
                                      Ver Estadísticas
                                      <BarChart2 className="ml-2" size={16} />
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="sm:max-w-[800px]">
                                    <DialogHeader>
                                      <DialogTitle className="flex items-center text-2xl">
                                        <User className="mr-2" size={24} />
                                        Estadísticas de {selectedEmployee?.nombre}
                                      </DialogTitle>
                                      <DialogDescription>Resultados de evaluaciones anteriores</DialogDescription>
                                    </DialogHeader>
                                    <div className="mt-4">
                                      {loadingStats ? (
                                        <div className="flex justify-center items-center h-64">
                                          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-green-500"></div>
                                        </div>
                                      ) : employeeStats ? (
                                        <div className="space-y-6">
                                          <div className="relative" ref={chartContainerRef}>
                                            <AnimatePresence mode="wait">
                                              <motion.div
                                                key={currentChartIndex}
                                                initial={{ opacity: 0, x: 300 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -300 }}
                                                transition={{ duration: 0.5 }}
                                              >
                                                {charts[currentChartIndex].render()}
                                              </motion.div>
                                            </AnimatePresence>
                                            <Button
                                              className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-full bg-green-500 hover:bg-green-600"
                                              onClick={prevChart}
                                            >
                                              <ChevronLeft size={24} />
                                            </Button>
                                            <Button
                                              className="absolute top-1/2 right-0 transform -translate-y-1/2 translate-x-full bg-green-500 hover:bg-green-600"
                                              onClick={nextChart}
                                            >
                                              <ChevronRight size={24} />
                                            </Button>
                                          </div>
                                          <div className="text-center text-sm text-gray-500">
                                            Haga doble clic en un elemento del gráfico para ver más detalles
                                          </div>
                                        </div>
                                      ) : (
                                        <p className="text-center text-gray-500">
                                          No se encontraron estadísticas para este empleado.
                                        </p>
                                      )}
                                    </div>
                                  </DialogContent>
                                </Dialog>
                              </div>
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
        <IndicatorDetails
          isOpen={detailsOpen}
          onClose={() => setDetailsOpen(false)}
          data={selectedIndicator}
          title={charts[currentChartIndex].title}
        />
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

