import type React from "react"
import { useState, useCallback, useMemo } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Calendar, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Sparkles } from "lucide-react"

interface EvaluationHistory {
  fecha_evaluacion: string
  anio: number
  cargo: string
  compromiso: number
  honestidad: number
  respeto: number
  sencillez: number
  servicio: number
  trabajo_equipo: number
  conocimiento_trabajo: number
  productividad: number
  cumple_sistema_gestion: number
  total_puntos: number
  porcentaje_calificacion: string
  acuerdos_mejora_desempeno_colaborador: string
  acuerdos_mejora_desempeno_jefe: string
  necesidades_desarrollo: string
  aspectos_positivos: string
}

interface HistorySectionProps {
  evaluationHistory: EvaluationHistory[]
}

export const HistorySection: React.FC<HistorySectionProps> = ({ evaluationHistory }) => {
  const [currentPage, setCurrentPage] = useState(0)
  const [expandedCard, setExpandedCard] = useState<number | null>(null)
  const evaluationsPerPage = 2

  const totalPages = Math.ceil(evaluationHistory.length / evaluationsPerPage)
  const paginatedEvaluations = useMemo(
    () => evaluationHistory.slice(currentPage * evaluationsPerPage, (currentPage + 1) * evaluationsPerPage),
    [evaluationHistory, currentPage],
  )

  const nextPage = useCallback(() => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))
    setExpandedCard(null)
  }, [totalPages])

  const prevPage = useCallback(() => {
    setCurrentPage((prev) => Math.max(prev - 1, 0))
    setExpandedCard(null)
  }, [])

  const toggleExpand = useCallback((index: number) => {
    setExpandedCard((prev) => (prev === index ? null : index))
  }, [])

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } },
      }}
      initial="hidden"
      animate="visible"
      className="bg-gradient-to-br from-white/60 to-white/30 backdrop-blur-sm rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-white/50"
    >
      <h2 className="text-2xl font-bold text-green-900 mb-8 flex items-center gap-3">
        <Sparkles className="w-6 h-6" />
        Historial de Evaluaciones
      </h2>
      {evaluationHistory.length === 0 ? (
        <p className="text-green-700">No hay evaluaciones previas.</p>
      ) : (
        <>
          <div className="space-y-6">
            {paginatedEvaluations.map((evaluation, index) => (
              <motion.div
                key={index}
                className="bg-white/50 rounded-xl shadow-md overflow-hidden"
                initial={{ height: "auto" }}
                animate={{ height: expandedCard === index ? "auto" : "150px" }}
                transition={{ duration: 0.3 }}
              >
                <div className="p-6">
                  <div className="cursor-pointer" onClick={() => toggleExpand(index)}>
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-lg font-semibold text-green-800 flex items-center gap-2">
                          <Calendar className="w-5 h-5" />
                          Periodo Evaluado: {evaluation.anio}
                        </h3>
                        <p className="text-sm text-green-600 mt-1">
                          Fecha de evaluación: {new Date(evaluation.fecha_evaluacion).toLocaleDateString()}
                        </p>
                      </div>
                      <Button
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleExpand(index)
                        }}
                        variant="ghost"
                        size="sm"
                        className="text-green-600 hover:text-green-800"
                      >
                        {expandedCard === index ? (
                          <ChevronUp className="w-5 h-5" />
                        ) : (
                          <ChevronDown className="w-5 h-5" />
                        )}
                      </Button>
                    </div>
                    <p className="text-green-700 mt-2">Cargo: {evaluation.cargo}</p>
                    <p className="text-sm font-medium text-green-800 mt-2">
                      Calificación total: {evaluation.porcentaje_calificacion}
                    </p>
                  </div>
                  {expandedCard === index && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className="mt-4"
                    >
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          {[
                            "compromiso",
                            "honestidad",
                            "respeto",
                            "sencillez",
                            "servicio",
                            "trabajo_equipo",
                            "conocimiento_trabajo",
                            "productividad",
                            "cumple_sistema_gestion",
                          ].map((key) => (
                            <p
                              key={key}
                              className={`text-sm ${
                                Number(evaluation[key as keyof typeof evaluation]) >= 3
                                  ? "text-green-600"
                                  : Number(evaluation[key as keyof typeof evaluation]) === 2
                                    ? "text-yellow-600"
                                    : "text-red-600"
                              }`}
                            >
                              {key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, " ")}:{" "}
                              {evaluation[key as keyof typeof evaluation]}
                            </p>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-2 mt-4">
                        <p className="text-sm text-green-700">
                          <strong>Acuerdos del colaborador:</strong> {evaluation.acuerdos_mejora_desempeno_colaborador}
                        </p>
                        <p className="text-sm text-green-700">
                          <strong>Acuerdos del jefe:</strong> {evaluation.acuerdos_mejora_desempeno_jefe}
                        </p>
                        <p className="text-sm text-green-700">
                          <strong>Necesidades de desarrollo:</strong> {evaluation.necesidades_desarrollo}
                        </p>
                        <p className="text-sm text-green-700">
                          <strong>Aspectos positivos:</strong> {evaluation.aspectos_positivos}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
          <div className="flex justify-between mt-6">
            <Button
              onClick={prevPage}
              disabled={currentPage === 0}
              className="px-4 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors duration-200 disabled:opacity-50"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <span className="text-green-800">
              Página {currentPage + 1} de {totalPages}
            </span>
            <Button
              onClick={nextPage}
              disabled={currentPage === totalPages - 1}
              className="px-4 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors duration-200 disabled:opacity-50"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </>
      )}
    </motion.div>
  )
}

