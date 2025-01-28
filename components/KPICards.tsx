import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"

interface Evaluation {
  porcentaje_calificacion: number
}

interface Props {
  evaluations: Evaluation[]
}

export function KPICards({ evaluations }: Props) {
  const calculateKPIs = () => {
    const totalEvaluations = evaluations.length
    const averageScore = totalEvaluations > 0 
    ? evaluations.reduce((sum, evaluation) => sum + evaluation.porcentaje_calificacion, 0) / totalEvaluations 
    : 0;
    const highPerformers = evaluations.filter((evaluation) => evaluation.porcentaje_calificacion >= 90).length
    const lowPerformers = evaluations.filter((evaluation) => evaluation.porcentaje_calificacion < 60).length

    return {
      totalEvaluations,
      averageScore: averageScore.toFixed(2),
      highPerformers,
      lowPerformers,
    }
  }

  const kpis = calculateKPIs()

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {Object.entries(kpis).map(([key, value], index) => (
        <motion.div
          key={key}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {key === "totalEvaluations"
                  ? "Total de Evaluaciones"
                  : key === "averageScore"
                    ? "Promedio de Calificación"
                    : key === "highPerformers"
                      ? "Alto Desempeño (≥90%)"
                      : "Bajo Desempeño (<60%)"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{key === "averageScore" ? `${value}%` : value}</div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}

