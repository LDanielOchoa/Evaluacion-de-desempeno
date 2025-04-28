"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"
import { Users, BarChart, TrendingUp, TrendingDown, Minus } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Evaluation {
  porcentaje_calificacion: number
  nombres_apellidos?: string
  cargo?: string
  cedula?: string
}

interface Props {
  evaluations: Evaluation[]
}

export function KPICards({ evaluations }: Props) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const calculateKPIs = () => {
    const totalEvaluations = evaluations.length
    const averageScore =
      totalEvaluations > 0
        ? evaluations.reduce((sum, evaluation) => sum + evaluation.porcentaje_calificacion, 0) / totalEvaluations
        : 0
    const highPerformers = evaluations.filter((evaluation) => evaluation.porcentaje_calificacion >= 90)
    const midPerformers = evaluations.filter(
      (evaluation) => evaluation.porcentaje_calificacion >= 60 && evaluation.porcentaje_calificacion < 90,
    )
    const lowPerformers = evaluations.filter((evaluation) => evaluation.porcentaje_calificacion < 60)

    return {
      totalEvaluations,
      averageScore: averageScore.toFixed(2),
      highPerformers,
      midPerformers,
      lowPerformers,
    }
  }

  const kpis = calculateKPIs()

  const kpiConfig = [
    { key: "totalEvaluations", label: "Total de Evaluaciones", icon: Users, color: "text-blue-500", clickable: false },
    {
      key: "averageScore",
      label: "Promedio de Calificación",
      icon: BarChart,
      color: "text-purple-500",
      clickable: false,
    },
    {
      key: "highPerformers",
      label: "Alto Desempeño (≥90%)",
      icon: TrendingUp,
      color: "text-green-500",
      clickable: true,
    },
    { key: "midPerformers", label: "Desempeño Medio (60-89%)", icon: Minus, color: "text-yellow-500", clickable: true },
    {
      key: "lowPerformers",
      label: "Bajo Desempeño (<60%)",
      icon: TrendingDown,
      color: "text-red-500",
      clickable: true,
    },
  ]

  const handleCardClick = (key: string) => {
    if (key === "highPerformers" || key === "midPerformers" || key === "lowPerformers") {
      setSelectedCategory(key)
      setIsDialogOpen(true)
    }
  }

  const getCategoryEmployees = () => {
    if (!selectedCategory) return []

    return kpis[selectedCategory as keyof typeof kpis] as Evaluation[]
  }

  const getCategoryTitle = () => {
    const config = kpiConfig.find((item) => item.key === selectedCategory)
    return config ? config.label : ""
  }

  const getCategoryColor = () => {
    const config = kpiConfig.find((item) => item.key === selectedCategory)
    return config ? config.color.replace("text", "bg") : ""
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {kpiConfig.map(({ key, label, icon: Icon, color, clickable }, index) => {
          const value = kpis[key as keyof typeof kpis]
          const percentage =
            key !== "totalEvaluations" && key !== "averageScore"
              ? ((Array.isArray(value) ? value.length : Number(value)) / kpis.totalEvaluations) * 100
              : null

          return (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card
                className={`overflow-hidden ${clickable ? "cursor-pointer hover:shadow-md transition-shadow" : ""}`}
                onClick={() => clickable && handleCardClick(key)}
              >
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Icon className={`h-5 w-5 ${color}`} />
                    {label}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold mb-2">
                    {key === "averageScore" ? `${value}%` : Array.isArray(value) ? value.length : value}
                  </div>
                  {percentage !== null && (
                    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 overflow-hidden">
                      <div
                        className={`h-2.5 rounded-full ${color.replace("text", "bg")}`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedCategory === "highPerformers" && <TrendingUp className="h-5 w-5 text-green-500" />}
              {selectedCategory === "midPerformers" && <Minus className="h-5 w-5 text-yellow-500" />}
              {selectedCategory === "lowPerformers" && <TrendingDown className="h-5 w-5 text-red-500" />}
              {getCategoryTitle()}
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh]">
            <div className="space-y-2 p-2">
              {getCategoryEmployees().length > 0 ? (
                getCategoryEmployees().map((employee, index) => (
                  <div
                    key={index}
                    className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                  >
                    <div className="font-medium">{employee.nombres_apellidos || "Empleado"}</div>
                    <div className="text-sm text-muted-foreground flex justify-between">
                      <span>{employee.cargo || "Cargo no especificado"}</span>
                      <span className="font-semibold">{employee.porcentaje_calificacion}%</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-muted-foreground">No hay empleados en esta categoría</div>
              )}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  )
}
