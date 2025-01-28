import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell } from "recharts"
import { motion } from "framer-motion"

interface Evaluation {
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

export function AverageScoresChart({ evaluations }: Props) {
  const calculateAverages = () => {
    const sum = evaluations.reduce(
      (acc, evaluation) => ({
        compromiso: acc.compromiso + evaluation.compromiso,
        honestidad: acc.honestidad + evaluation.honestidad,
        respeto: acc.respeto + evaluation.respeto,
        sencillez: acc.sencillez + evaluation.sencillez,
        servicio: acc.servicio + evaluation.servicio,
        trabajo_equipo: acc.trabajo_equipo + evaluation.trabajo_equipo,
        conocimiento_trabajo: acc.conocimiento_trabajo + evaluation.conocimiento_trabajo,
        productividad: acc.productividad + evaluation.productividad,
        cumple_sistema_gestion: acc.cumple_sistema_gestion + evaluation.cumple_sistema_gestion,
      }),
      {
        compromiso: 0,
        honestidad: 0,
        respeto: 0,
        sencillez: 0,
        servicio: 0,
        trabajo_equipo: 0,
        conocimiento_trabajo: 0,
        productividad: 0,
        cumple_sistema_gestion: 0,
      },
    )

    const count = evaluations.length
    return Object.entries(sum).map(([key, value]) => ({
      name: key.replace(/_/g, " ").charAt(0).toUpperCase() + key.replace(/_/g, " ").slice(1),
      average: Number((value / count).toFixed(2)),
    }))
  }

  const averages = calculateAverages()
  const colors = ["#4ade80", "#22c55e", "#16a34a", "#15803d", "#166534", "#14532d", "#052e16", "#022c22", "#134e4a"]

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card>
        <CardHeader>
          <CardTitle>Promedio de Calificaciones por Criterio</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={averages} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <XAxis type="number" domain={[0, 4]} />
              <YAxis dataKey="name" type="category" width={150} />
              <Tooltip
                contentStyle={{ backgroundColor: "rgba(255, 255, 255, 0.8)", borderRadius: "0.5rem" }}
                labelStyle={{ fontWeight: "bold" }}
              />
              <Bar dataKey="average" animationBegin={0} animationDuration={2000}>
                {averages.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </motion.div>
  )
}

