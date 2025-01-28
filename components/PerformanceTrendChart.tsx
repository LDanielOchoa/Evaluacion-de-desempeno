import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts"
import { motion } from "framer-motion"

interface Evaluation {
  anio: number
  compromiso: number
  honestidad: number
  respeto: number
  sencillez: number
  servicio: number
  trabajo_equipo: number
  conocimiento_trabajo: number
  productividad: number
  cumple_sistema_gestion: number
}

interface Props {
  evaluations: Evaluation[]
}

export function PerformanceTrendChart({ evaluations }: Props) {
  const calculateYearlyAverages = () => {
    const yearlyData: { [key: number]: { [key: string]: { total: number; count: number } } } = {}
    evaluations.forEach((evaluation) => {
      if (!yearlyData[evaluation.anio]) {
        yearlyData[evaluation.anio] = {}
      }
      Object.entries(evaluation).forEach(([key, value]) => {
        if (typeof value === 'number' && key !== 'anio') {
          if (!yearlyData[evaluation.anio][key]) {
            yearlyData[evaluation.anio][key] = { total: 0, count: 0 }
          }
          yearlyData[evaluation.anio][key].total += value
          yearlyData[evaluation.anio][key].count += 1
        }
      })
    })

    return Object.entries(yearlyData)
      .map(([year, data]) => ({
        year: Number(year),
        ...Object.entries(data).reduce(
          (acc, [key, value]) => ({
            ...acc,
            [key]: Number((value.total / value.count).toFixed(2)),
          }),
          {},
        ),
      }))
      .sort((a, b) => a.year - b.year)
  }

  const yearlyAverages = calculateYearlyAverages()

  const colors = ["#4ade80", "#22c55e", "#16a34a", "#15803d", "#166534", "#14532d", "#052e16", "#022c22", "#134e4a"]

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card>
        <CardHeader>
          <CardTitle>Tendencias de Desempeño por Año</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={500}>
            <LineChart data={yearlyAverages} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis domain={[0, 4]} />
              <Tooltip />
              <Legend />
              {Object.keys(yearlyAverages[0] || {})
                .filter((key) => key !== "year")
                .map((key, index) => (
                  <Line
                    key={key}
                    type="monotone"
                    dataKey={key}
                    stroke={colors[index % colors.length]}
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 8 }}
                  />
                ))}
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </motion.div>
  )
}

