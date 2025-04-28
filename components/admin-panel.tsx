"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { AverageScoresChart } from "./AverageScoreChart"
import { ScoreDistributionChart } from "./ScoreDistributionChart"
import { YearlyProgressChart } from "./YearlyProgressChart"
import { TopPerformersCard } from "./TopPerformersCard"
import { EvaluationSummary } from "./EvaluationSummary"
import { KPICards } from "./KPICards"
import { PerformanceTrendChart } from "./PerformanceTrendChart"
import { DepartmentComparisonChart } from "./DepartmentComparisonChart"
import { UserManagement } from "./UserManagement"
import {
  Loader2,
  Search,
  Calendar,
  Building2,
  ChevronLeft,
  ChevronRight,
  BarChart2,
  FileText,
  Users,
  Filter,
} from "lucide-react"
import { Button } from "@/components/ui/button"

interface Evaluation {
  cedula: string
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
  porcentaje_calificacion: number
  acuerdos_mejora_desempeno_colaborador: string
  acuerdos_mejora_desempeno_jefe: string
  necesidades_desarrollo: string
  aspectos_positivos: string
  departamento: string
  area_jefe_pertenencia: string
  nombres_apellidos: string
}

const pageVariants = {
  initial: { opacity: 0 },
  in: { opacity: 1 },
  out: { opacity: 0 },
}

const pageTransition = {
  type: "tween",
  ease: "anticipate",
  duration: 0.5,
}

const sidebarVariants = {
  open: { width: "240px", transition: { duration: 0.3 } },
  closed: { width: "80px", transition: { duration: 0.3 } },
}

const contentVariants = {
  open: { marginLeft: "240px", transition: { duration: 0.3 } },
  closed: { marginLeft: "80px", transition: { duration: 0.3 } },
}

const navItems = [
  { id: "charts", label: "Gráficos Generales", icon: BarChart2 },
  { id: "summary", label: "Resumen de Evaluaciones", icon: FileText },
  { id: "users", label: "Gestión de Usuarios", icon: Users },
]

export default function AdminPanel() {
  const [evaluations, setEvaluations] = useState<Evaluation[]>([])
  const [filteredEvaluations, setFilteredEvaluations] = useState<Evaluation[]>([])
  const [cedulaFilter, setCedulaFilter] = useState("")
  const [yearFilter, setYearFilter] = useState<string>("all")
  const [departmentFilter, setDepartmentFilter] = useState<string>("all")
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("charts")
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    fetchEvaluations()
  }, [])

  const fetchEvaluations = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("https://evaluacion-de-desempeno.onrender.com/get_all_evaluations")
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      if (data.success) {
        setEvaluations(data.evaluations)
        setFilteredEvaluations(data.evaluations)
      } else {
        console.error("Error fetching evaluations:", data.error)
      }
    } catch (error) {
      console.error("Error fetching evaluations:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setCedulaFilter(value)
    applyFilters(value, yearFilter, departmentFilter)
  }

  const handleYearFilterChange = (value: string) => {
    setYearFilter(value)
    applyFilters(cedulaFilter, value, departmentFilter)
  }

  const handleDepartmentFilterChange = (value: string) => {
    setDepartmentFilter(value)
    applyFilters(cedulaFilter, yearFilter, value)
  }

  const applyFilters = (cedula: string, year: string, area_jefe_pertenencia: string) => {
    let filtered = evaluations
    if (cedula) {
      filtered = filtered.filter((evaluation) => evaluation.cedula.toString().includes(cedula))
    }
    if (year !== "all") {
      filtered = filtered.filter((evaluation) => evaluation.anio.toString() === year)
    }
    if (area_jefe_pertenencia !== "all") {
      filtered = filtered.filter((evaluation) => evaluation.area_jefe_pertenencia === area_jefe_pertenencia)
    }
    setFilteredEvaluations(filtered)
  }

  const uniqueYears = Array.from(new Set(evaluations.map((evaluation) => evaluation.anio))).sort((a, b) => b - a)
  const uniqueDepartments = Array.from(
    new Set(evaluations.map((evaluation) => evaluation.area_jefe_pertenencia)),
  ).filter(Boolean)

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const toggleFilters = () => {
    setShowFilters(!showFilters)
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900 dark:to-emerald-800">
      <motion.div
        className="fixed left-0 top-0 h-full bg-white/80 dark:bg-green-800/80 backdrop-blur-lg shadow-lg z-20 overflow-hidden"
        variants={sidebarVariants}
        animate={isSidebarOpen ? "open" : "closed"}
      >
        <div className="p-4 flex justify-between items-center">
          <h2 className={`text-xl font-bold text-green-800 dark:text-green-100 ${!isSidebarOpen && "hidden"}`}>
            Panel de Administrador
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="text-green-600 dark:text-green-300 hover:text-green-900 dark:hover:text-green-50"
          >
            {isSidebarOpen ? <ChevronLeft size={24} /> : <ChevronRight size={24} />}
          </Button>
        </div>
        <nav className="mt-8">
          {navItems.map((item) => (
            <Button
              key={item.id}
              variant={activeTab === item.id ? "secondary" : "ghost"}
              className={`w-full justify-start mb-2 ${!isSidebarOpen && "justify-center"} ${
                activeTab === item.id
                  ? "bg-green-200 text-green-800 dark:bg-green-700 dark:text-green-100"
                  : "text-green-600 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-700/50"
              }`}
              onClick={() => setActiveTab(item.id)}
            >
              <item.icon className="mr-2" size={20} />
              {isSidebarOpen && <span>{item.label}</span>}
            </Button>
          ))}
        </nav>
      </motion.div>

      <motion.div
        className="flex-1 overflow-x-hidden"
        variants={contentVariants}
        animate={isSidebarOpen ? "open" : "closed"}
      >
        <motion.div
          initial="initial"
          animate="in"
          exit="out"
          variants={pageVariants}
          transition={pageTransition}
          className="p-8 relative"
        >
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-green-800 dark:text-green-100">
                {navItems.find((item) => item.id === activeTab)?.label}
              </h1>
              <div className="flex items-center space-x-4">
                <div className="text-sm text-green-600 dark:text-green-300">
                  Última actualización: {new Date().toLocaleString()}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleFilters}
                  className="bg-white/50 dark:bg-green-800/50 text-green-600 dark:text-green-300 border-green-300 dark:border-green-600 hover:bg-green-100 dark:hover:bg-green-700/50"
                >
                  <Filter size={16} className="mr-2" />
                  Filtros
                </Button>
              </div>
            </div>

            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="mb-8"
                >
                  <Card className="bg-white/80 dark:bg-green-800/80 backdrop-blur-lg shadow-lg border-green-200 dark:border-green-700">
                    <CardContent className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="relative">
                          <Search
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-400"
                            size={18}
                          />
                          <Input
                            type="text"
                            placeholder="Filtrar por Cédula"
                            value={cedulaFilter}
                            onChange={handleFilterChange}
                            className="pl-10 bg-white/50 dark:bg-green-700/50 border-green-200 dark:border-green-600 focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 text-green-800 dark:text-green-100"
                          />
                        </div>
                        <div className="relative">
                          <Calendar
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-400"
                            size={18}
                          />
                          <Select value={yearFilter} onValueChange={handleYearFilterChange}>
                            <SelectTrigger className="w-full pl-10 bg-white/50 dark:bg-green-700/50 border-green-200 dark:border-green-600 focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 text-green-800 dark:text-green-100">
                              <SelectValue placeholder="Seleccionar año" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">Todos los años</SelectItem>
                              {uniqueYears.map((year) => (
                                <SelectItem key={year} value={year.toString()}>
                                  {year.toString()}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="relative">
                          <Building2
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-400"
                            size={18}
                          />
                          <Select value={departmentFilter} onValueChange={handleDepartmentFilterChange}>
                            <SelectTrigger className="w-full pl-10 bg-white/50 dark:bg-green-700/50 border-green-200 dark:border-green-600 focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 text-green-800 dark:text-green-100">
                              <SelectValue placeholder="Seleccionar área" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">Todas las áreas</SelectItem>
                              {uniqueDepartments.map((area_jefe_pertenencia, index) => (
                                <SelectItem key={index} value={area_jefe_pertenencia}>
                                  {area_jefe_pertenencia.toString()}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex justify-center items-center h-64"
                >
                  <Loader2 className="h-16 w-16 animate-spin text-green-500" />
                </motion.div>
              ) : (
                <motion.div
                  key="content"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="mb-8">
                    <Card className="bg-white/80 dark:bg-green-800/80 backdrop-blur-lg shadow-lg border-green-200 dark:border-green-700">
                      <CardContent className="p-6">
                        <KPICards evaluations={filteredEvaluations} />
                      </CardContent>
                    </Card>
                  </div>

                  <AnimatePresence mode="wait">
                    {activeTab === "charts" && (
                      <motion.div
                        key="charts"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className="space-y-8"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <Card className="bg-white/80 dark:bg-green-800/80 backdrop-blur-lg shadow-lg border-green-200 dark:border-green-700">
                            <CardContent className="p-6">
                              <AverageScoresChart evaluations={filteredEvaluations} />
                            </CardContent>
                          </Card>
                          <Card className="bg-white/80 dark:bg-green-800/80 backdrop-blur-lg shadow-lg border-green-200 dark:border-green-700">
                            <CardContent className="p-6">
                              <ScoreDistributionChart evaluations={filteredEvaluations} />
                            </CardContent>
                          </Card>
                        </div>
                        <Card className="bg-white/80 dark:bg-green-800/80 backdrop-blur-lg shadow-lg border-green-200 dark:border-green-700">
                          <CardContent className="p-6">
                            <YearlyProgressChart evaluations={filteredEvaluations} />
                          </CardContent>
                        </Card>
                        <Card className="bg-white/80 dark:bg-green-800/80 backdrop-blur-lg shadow-lg border-green-200 dark:border-green-700">
                          <CardContent className="p-6">
                            <DepartmentComparisonChart evaluations={filteredEvaluations} />
                          </CardContent>
                        </Card>
                      </motion.div>
                    )}
                    {activeTab === "trends" && (
                      <motion.div
                        key="trends"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className="mt-8"
                      >
                        <Card className="bg-white/80 dark:bg-green-800/80 backdrop-blur-lg shadow-lg border-green-200 dark:border-green-700">
                          <CardContent className="p-6">
                            <PerformanceTrendChart evaluations={filteredEvaluations} />
                          </CardContent>
                        </Card>
                      </motion.div>
                    )}
                    {activeTab === "topPerformers" && (
                      <motion.div
                        key="topPerformers"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className="mt-8"
                      >
                        <Card className="bg-white/80 dark:bg-green-800/80 backdrop-blur-lg shadow-lg border-green-200 dark:border-green-700">
                          <CardContent className="p-6">
                            <TopPerformersCard evaluations={filteredEvaluations} />
                          </CardContent>
                        </Card>
                      </motion.div>
                    )}
                    {activeTab === "summary" && (
                      <motion.div
                        key="summary"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className="mt-8"
                      >
                        <Card className="bg-white/80 dark:bg-green-800/80 backdrop-blur-lg shadow-lg border-green-200 dark:border-green-700">
                          <CardContent className="p-6">
                            <EvaluationSummary evaluations={filteredEvaluations} />
                          </CardContent>
                        </Card>
                      </motion.div>
                    )}
                    {activeTab === "users" && (
                      <motion.div
                        key="users"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className="mt-8"
                      >
                        <Card className="bg-white/80 dark:bg-green-800/80 backdrop-blur-lg shadow-lg border-green-200 dark:border-green-700">
                          <CardContent className="p-6">
                            <UserManagement />
                          </CardContent>
                        </Card>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

