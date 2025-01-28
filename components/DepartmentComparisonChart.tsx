import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from "recharts"
import { motion } from "framer-motion"

interface Evaluation {
  departamento: string
  porcentaje_calificacion: number
  area_jefe_pertenencia: string
}

interface Props {
  evaluations: Evaluation[]
}

export function DepartmentComparisonChart({ evaluations }: Props) {
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

  const departmentAverages = calculateDepartmentAverages()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
    >
      <Card>
        <CardHeader>
          <CardTitle>Comparación de Desempeño por Areas</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={departmentAverages} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="area_jefe_pertenencia" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Legend />
              <Bar dataKey="average" fill="#4ade80" name="Promedio de Calificación (%)" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </motion.div>
  )
}

