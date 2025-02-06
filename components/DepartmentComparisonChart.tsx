"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Cell, ReferenceLine } from "recharts"
import { motion, AnimatePresence } from "framer-motion"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Button } from "@/components/ui/button"
import { ArrowUpCircle, ArrowDownCircle, BarChart3 } from "lucide-react"

interface Evaluation {
  departamento: string
  porcentaje_calificacion: number
  area_jefe_pertenencia: string
}

interface Props {
  evaluations: Evaluation[]
}

const COLORS = [
  "hsl(142, 76%, 36%)",
  "hsl(142, 76%, 46%)",
  "hsl(142, 76%, 56%)",
  "hsl(142, 76%, 66%)",
  "hsl(142, 76%, 76%)",
]

export function DepartmentComparisonChart({ evaluations }: Props) {
  const [departmentAverages, setDepartmentAverages] = useState<
    Array<{ area_jefe_pertenencia: string; average: number }>
  >([])
  const [isClient, setIsClient] = useState(false)
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")

  useEffect(() => {
    setIsClient(true)
    if (evaluations.length === 0) {
      setDepartmentAverages([])
      return
    }
    const calculateDepartmentAverages = () => {
      const departmentData: { [key: string]: { total: number; count: number } } = {}
      evaluations.forEach((evaluation) => {
        if (!departmentData[evaluation.area_jefe_pertenencia]) {
          departmentData[evaluation.area_jefe_pertenencia] = { total: 0, count: 0 }
        }
        departmentData[evaluation.area_jefe_pertenencia].total += evaluation.porcentaje_calificacion
        departmentData[evaluation.area_jefe_pertenencia].count += 1
      })

      return Object.entries(departmentData)
        .map(([area_jefe_pertenencia, data]) => ({
          area_jefe_pertenencia,
          average: Number((data.total / data.count).toFixed(2)),
        }))
        .sort((a, b) => b.average - a.average)
    }

    setDepartmentAverages(calculateDepartmentAverages())
  }, [evaluations])

  const toggleSortOrder = () => {
    setSortOrder((prevOrder) => (prevOrder === "desc" ? "asc" : "desc"))
    setDepartmentAverages((prev) =>
      [...prev].sort((a, b) => (sortOrder === "asc" ? b.average - a.average : a.average - b.average)),
    )
  }

  const overallAverage = departmentAverages.reduce((sum, dept) => sum + dept.average, 0) / departmentAverages.length

  if (!isClient) {
    return null // or a loading indicator
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-4xl mx-auto"
      >
        <Card className="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900 dark:to-emerald-800 shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center text-green-800 dark:text-green-100">
              Comparación de Desempeño por Áreas
            </CardTitle>
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                {overallAverage > 70 ? (
                  <ArrowUpCircle className="text-green-600 dark:text-green-400" />
                ) : (
                  <ArrowDownCircle className="text-red-600 dark:text-red-400" />
                )}
                <span className="text-sm font-medium text-green-700 dark:text-green-300">
                  Promedio general: {overallAverage.toFixed(2)}%
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={toggleSortOrder}
                className="bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-700 dark:text-green-100 dark:hover:bg-green-600"
              >
                <BarChart3 className="mr-2 h-4 w-4" />
                Ordenar {sortOrder === "desc" ? "↑" : "↓"}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {departmentAverages.length > 0 ? (
              <ChartContainer
                config={{
                  average: {
                    label: "Promedio",
                    color: "hsl(142, 76%, 36%)",
                  },
                }}
                className="h-[400px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={departmentAverages} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(142, 76%, 70%)" />
                    <XAxis
                      dataKey="area_jefe_pertenencia"
                      stroke="hsl(142, 76%, 36%)"
                      angle={-45}
                      textAnchor="end"
                      interval={0}
                      tick={{ fontSize: 12 }}
                      height={100}
                    />
                    <YAxis stroke="hsl(142, 76%, 36%)" domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
                    <ReferenceLine
                      y={70}
                      stroke="hsl(142, 76%, 50%)"
                      strokeDasharray="3 3"
                      label={{ value: "Aprobado", position: "insideTopLeft", fill: "hsl(142, 76%, 36%)", fontSize: 12 }}
                    />
                    <ChartTooltip
                      content={({ payload, label }) => (
                        <ChartTooltipContent payload={payload} label={label} formatter={(value) => `${value}%`} />
                      )}
                    />
                    <Bar dataKey="average" name="Promedio de Calificación" fill="hsl(142, 76%, 36%)">
                      {departmentAverages.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            ) : (
              <p className="text-center text-green-800 dark:text-green-100 py-8">No hay datos disponibles</p>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  )
}

