import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"

interface Evaluation {
  nombres_apellidos: string
  cedula: string
  cargo: string
  fecha_evaluacion: string
  porcentaje_calificacion: number
  acuerdos_mejora_desempeno_colaborador: string
  acuerdos_mejora_desempeno_jefe: string
  necesidades_desarrollo: string
  aspectos_positivos: string
}

interface Props {
  evaluations: Evaluation[]
}

export function EvaluationSummary({ evaluations }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      {evaluations.map((evaluation, index) => (
        <motion.div
          key={`${evaluation.cedula}-${evaluation.fecha_evaluacion}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Evaluación de {evaluation.nombres_apellidos}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="font-semibold">Cargo: {evaluation.cargo}</p>
                <p>Fecha de Evaluación: {new Date(evaluation.fecha_evaluacion).toLocaleDateString()}</p>
                <p className="text-xl font-bold text-green-600">
                  Calificación:{" "}
                  {typeof evaluation.porcentaje_calificacion === "number"
                    ? `${evaluation.porcentaje_calificacion.toFixed(1)}%`
                    : "N/A"}
                </p>
              </div>
              <div>
                <h4 className="font-semibold">Acuerdos de mejora (Colaborador):</h4>
                <p>{evaluation.acuerdos_mejora_desempeno_colaborador}</p>
              </div>
              <div>
                <h4 className="font-semibold">Acuerdos de mejora (Jefe):</h4>
                <p>{evaluation.acuerdos_mejora_desempeno_jefe}</p>
              </div>
              <div>
                <h4 className="font-semibold">Necesidades de desarrollo:</h4>
                <p>{evaluation.necesidades_desarrollo}</p>
              </div>
              <div>
                <h4 className="font-semibold">Aspectos positivos:</h4>
                <p>{evaluation.aspectos_positivos}</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  )
}

