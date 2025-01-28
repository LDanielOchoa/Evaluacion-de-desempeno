import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Pie, PieChart, ResponsiveContainer, Tooltip, Cell, Legend } from "recharts"
import { motion } from "framer-motion"

interface Evaluation {
  porcentaje_calificacion: number
}

interface Props {
  evaluations: Evaluation[]
}

const COLORS = ["#4ade80", "#22c55e", "#16a34a", "#15803d"]

export function ScoreDistributionChart({ evaluations }: Props) {
  const calculateDistribution = () => {
    const distribution = [
      { name: "0-25%", value: 0 },
      { name: "26-50%", value: 0 },
      { name: "51-75%", value: 0 },
      { name: "76-100%", value: 0 },
    ]

    evaluations.forEach((evaluation) => {
      if (evaluation.porcentaje_calificacion <= 25) distribution[0].value++
      else if (evaluation.porcentaje_calificacion <= 50) distribution[1].value++
      else if (evaluation.porcentaje_calificacion <= 75) distribution[2].value++
      else distribution[3].value++
    })

    return distribution
  }

  const distribution = calculateDistribution()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card>
        <CardHeader>
          <CardTitle>Distribución de Calificaciones</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={distribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={150}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                animationBegin={0}
                animationDuration={2000}
              >
                {distribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </motion.div>
  )
}

