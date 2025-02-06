import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"
import { Users, BarChart, TrendingUp, TrendingDown, Minus } from "lucide-react"

interface Evaluation {
  porcentaje_calificacion: number
}

interface Props {
  evaluations: Evaluation[]
}

export function KPICards({ evaluations }: Props) {
  const calculateKPIs = () => {
    const totalEvaluations = evaluations.length
    const averageScore =
      totalEvaluations > 0
        ? evaluations.reduce((sum, evaluation) => sum + evaluation.porcentaje_calificacion, 0) / totalEvaluations
        : 0
    const highPerformers = evaluations.filter((evaluation) => evaluation.porcentaje_calificacion >= 90).length
    const midPerformers = evaluations.filter(
      (evaluation) => evaluation.porcentaje_calificacion >= 60 && evaluation.porcentaje_calificacion < 90,
    ).length
    const lowPerformers = evaluations.filter((evaluation) => evaluation.porcentaje_calificacion < 60).length

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
    { key: "totalEvaluations", label: "Total de Evaluaciones", icon: Users, color: "text-blue-500" },
    { key: "averageScore", label: "Promedio de Calificación", icon: BarChart, color: "text-purple-500" },
    { key: "highPerformers", label: "Alto Desempeño (≥90%)", icon: TrendingUp, color: "text-green-500" },
    { key: "midPerformers", label: "Desempeño Medio (60-89%)", icon: Minus, color: "text-yellow-500" },
    { key: "lowPerformers", label: "Bajo Desempeño (<60%)", icon: TrendingDown, color: "text-red-500" },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 x:grid-cols-5 gap-4">
      {kpiConfig.map(({ key, label, icon: Icon, color }, index) => {
        const value = kpis[key as keyof typeof kpis]
        const percentage =
          key !== "totalEvaluations" && key !== "averageScore" ? (Number(value) / kpis.totalEvaluations) * 100 : null

        return (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Icon className={`h-5 w-5 ${color}`} />
                  {label}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold mb-2">{key === "averageScore" ? `${value}%` : value}</div>
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
  )
}

