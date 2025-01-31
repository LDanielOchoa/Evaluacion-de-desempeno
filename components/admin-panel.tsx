"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AverageScoresChart } from "./AverageScoreChart"
import { ScoreDistributionChart } from "./ScoreDistributionChart"
import { YearlyProgressChart } from "./YearlyProgressChart"
import { TopPerformersCard } from "./TopPerformersCard"
import { EvaluationSummary } from "./EvaluationSummary"
import { KPICards } from "./KPICards"
import { PerformanceTrendChart } from "./PerformanceTrendChart"
import { DepartmentComparisonChart } from "./DepartmentComparisonChart"
import { UserManagement } from "./UserManagement"

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

export default function AdminPanel() {
  const [evaluations, setEvaluations] = useState<Evaluation[]>([])
  const [filteredEvaluations, setFilteredEvaluations] = useState<Evaluation[]>([])
  const [cedulaFilter, setCedulaFilter] = useState("")
  const [yearFilter, setYearFilter] = useState<string>("all")
  const [departmentFilter, setDepartmentFilter] = useState<string>("all")
  const [isLoading, setIsLoading] = useState(true)

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto space-y-8"
      >
        <motion.h1
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-4xl font-bold text-green-800"
        >
          Panel de Administrador
        </motion.h1>

        <Card>
          <CardHeader>
            <CardTitle>Filtros</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col sm:flex-row gap-4">
            <Input
              type="text"
              placeholder="Filtrar por Cédula"
              value={cedulaFilter}
              onChange={handleFilterChange}
              className="max-w-sm"
            />
            <Select value={yearFilter} onValueChange={handleYearFilterChange}>
              <SelectTrigger className="w-[180px]">
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
            <Select value={departmentFilter} onValueChange={handleDepartmentFilterChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Seleccionar area" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las areas</SelectItem>
                {uniqueDepartments.map((area_jefe_pertenencia, index) => (
                  <SelectItem key={index} value={area_jefe_pertenencia}>
                    {area_jefe_pertenencia.toString()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <AnimatePresence>
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex justify-center items-center h-64"
            >
              <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-24 w-24"></div>
            </motion.div>
          ) : (
            <motion.div
              key="content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <KPICards evaluations={filteredEvaluations} />
              <Tabs defaultValue="charts" className="w-full mt-8">
                <TabsList className="grid w-full grid-cols-5 mb-8">
                  <TabsTrigger value="charts">Gráficos Generales</TabsTrigger>
                  <TabsTrigger value="trends">Tendencias</TabsTrigger>
                  <TabsTrigger value="topPerformers">Mejores Desempeños</TabsTrigger>
                  <TabsTrigger value="summary">Resumen de Evaluaciones</TabsTrigger>
                  <TabsTrigger value="users">Gestión de Usuarios</TabsTrigger>
                </TabsList>
                <TabsContent value="charts" className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <AverageScoresChart evaluations={filteredEvaluations} />
                    <ScoreDistributionChart evaluations={filteredEvaluations} />
                  </div>
                  <YearlyProgressChart evaluations={filteredEvaluations} />
                  <DepartmentComparisonChart evaluations={filteredEvaluations} />
                </TabsContent>
                <TabsContent value="trends">
                  <PerformanceTrendChart evaluations={filteredEvaluations} />
                </TabsContent>
                <TabsContent value="topPerformers">
                  <TopPerformersCard evaluations={filteredEvaluations} />
                </TabsContent>
                <TabsContent value="summary">
                  <EvaluationSummary evaluations={filteredEvaluations} />
                </TabsContent>
                <TabsContent value="users">
                  <UserManagement />
                </TabsContent>
              </Tabs>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

