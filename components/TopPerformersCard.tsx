import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"

interface Evaluation {
  cedula: string
  cargo: string
  porcentaje_calificacion: number
  nombres_apellidos: string
}

interface Props {
  evaluations: Evaluation[]
}

export function TopPerformersCard({ evaluations }: Props) {
  const getTopPerformers = () => {
    return evaluations.sort((a, b) => b.porcentaje_calificacion - a.porcentaje_calificacion).slice(0, 5)
  }

  const topPerformers = getTopPerformers()

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card>
        <CardHeader>
          <CardTitle>Top 5 Mejores Desempeños</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4">
            {topPerformers.map((performer, index) => (
              <motion.li
                key={performer.cedula}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex justify-between items-center bg-white p-4 rounded-lg shadow"
              >
                <div>
                  <p className="font-semibold">Cédula: {performer.nombres_apellidos}</p>
                  <p className="text-sm text-gray-600">{performer.cargo}</p>
                </div>
                <div className="text-2xl font-bold text-green-600">
                  {typeof performer.porcentaje_calificacion === "number"
                    ? `${performer.porcentaje_calificacion.toFixed(2)}%`
                    : "N/A"}
                </div>
              </motion.li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </motion.div>
  )
}

