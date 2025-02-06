"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Pie, PieChart, ResponsiveContainer, Tooltip, Cell, Legend, Label } from "recharts"
import { motion, AnimatePresence } from "framer-motion"

interface Evaluation {
  porcentaje_calificacion: number
}

interface Props {
  evaluations: Evaluation[]
}

const COLORS = ["#047857", "#10b981", "#34d399", "#6ee7b7"]
const HOVER_COLORS = ["#065f46", "#059669", "#10b981", "#34d399"]

export function ScoreDistributionChart({ evaluations }: Props) {
  const [activeIndex, setActiveIndex] = useState<number | undefined>()
  const [distribution, setDistribution] = useState<Array<{ name: string; value: number; label: string }>>([])
  const [totalEvaluations, setTotalEvaluations] = useState(0)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    const calculatedDistribution = [
      { name: "0-25", value: 0, label: "Insuficiente" },
      { name: "26-50", value: 0, label: "Regular" },
      { name: "51-75", value: 0, label: "Bueno" },
      { name: "76-100", value: 0, label: "Excelente" },
    ]

    evaluations.forEach((evaluation) => {
      if (evaluation.porcentaje_calificacion <= 25) calculatedDistribution[0].value++
      else if (evaluation.porcentaje_calificacion <= 50) calculatedDistribution[1].value++
      else if (evaluation.porcentaje_calificacion <= 75) calculatedDistribution[2].value++
      else calculatedDistribution[3].value++
    })

    setDistribution(calculatedDistribution)
    setTotalEvaluations(evaluations.length)
  }, [evaluations])

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index)
  }

  const onPieLeave = () => {
    setActiveIndex(undefined)
  }

  if (!isClient) {
    return null // or a loading indicator
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-3xl mx-auto"
      >
        <Card className="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900 dark:to-emerald-800 shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center text-green-800 dark:text-green-100">
              Distribución de Calificaciones
            </CardTitle>
            <p className="text-center text-green-600 dark:text-green-300">Análisis de los rangos de calificación</p>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={distribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={150}
                    innerRadius={60}
                    fill="#8884d8"
                    dataKey="value"
                    onMouseEnter={onPieEnter}
                    onMouseLeave={onPieLeave}
                  >
                    {distribution.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          activeIndex === index
                            ? HOVER_COLORS[index % HOVER_COLORS.length]
                            : COLORS[index % COLORS.length]
                        }
                        stroke="none"
                      />
                    ))}
                    <Label
                      content={({ viewBox }) => {
                        const { cx, cy } = viewBox
                        return (
                          <text x={cx} y={cy} fill="#047857" textAnchor="middle" dominantBaseline="central">
                            <tspan fontSize="24" fontWeight="bold">
                              {totalEvaluations}
                            </tspan>
                            <tspan x={cx} y={cy + 20} fontSize="14">
                              Total
                            </tspan>
                          </text>
                        )
                      }}
                    />
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload
                        return (
                          <div className="bg-white dark:bg-green-800 p-3 rounded-lg shadow-md border border-green-200 dark:border-green-700">
                            <p className="font-semibold text-green-800 dark:text-green-100">{`${data.label} (${data.name}%)`}</p>
                            <p className="text-lg font-bold text-green-600 dark:text-green-300">{`${data.value} evaluaciones`}</p>
                            <p className="text-sm text-green-500 dark:text-green-400">{`${((data.value / totalEvaluations) * 100).toFixed(2)}% del total`}</p>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    content={({ payload }) => (
                      <ul className="flex flex-wrap justify-center gap-4 mt-4">
                        {payload.map((entry: any, index: number) => (
                          <li key={`item-${index}`} className="flex items-center">
                            <span
                              className="w-4 h-4 rounded-full mr-2"
                              style={{ backgroundColor: COLORS[index % COLORS.length] }}
                            />
                            <span className="text-sm font-medium text-green-700 dark:text-green-200">
                              {entry.payload.name}%
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  )
}

