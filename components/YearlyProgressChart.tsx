"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, ReferenceLine } from "recharts"
import { motion, AnimatePresence } from "framer-motion"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Button } from "@/components/ui/button"
import { ArrowUpCircle, ArrowDownCircle, TrendingUp } from "lucide-react"

interface Evaluation {
  anio: number
  porcentaje_calificacion: number
}

interface Props {
  evaluations: Evaluation[]
}

export function YearlyProgressChart({ evaluations }: Props) {
  const [yearlyAverages, setYearlyAverages] = useState<Array<{ year: number; average: number }>>([])
  const [isClient, setIsClient] = useState(false)
  const [showTrendline, setShowTrendline] = useState(false)

  useEffect(() => {
    setIsClient(true)
    if (evaluations.length === 0) {
      setYearlyAverages([])
      return
    }
    const calculateYearlyAverages = () => {
      const yearlyData: { [key: number]: { total: number; count: number } } = {}
      evaluations.forEach((evaluation) => {
        if (!yearlyData[evaluation.anio]) {
          yearlyData[evaluation.anio] = { total: 0, count: 0 }
        }
        yearlyData[evaluation.anio].total += evaluation.porcentaje_calificacion
        yearlyData[evaluation.anio].count += 1
      })

      return Object.entries(yearlyData)
        .map(([year, data]) => ({
          year: Number(year),
          average: Number((data.total / data.count).toFixed(2)),
        }))
        .sort((a, b) => a.year - b.year)
    }

    setYearlyAverages(calculateYearlyAverages())
  }, [evaluations])

  const getOverallTrend = () => {
    if (!yearlyAverages || yearlyAverages.length < 2) return 0
    const firstYear = yearlyAverages[0]
    const lastYear = yearlyAverages[yearlyAverages.length - 1]
    return lastYear.average - firstYear.average
  }

  const overallTrend = getOverallTrend()

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
        className="w-full max-w-4xl mx-auto"
      >
        <Card className="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900 dark:to-emerald-800 shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center text-green-800 dark:text-green-100">
              Evolución de Calificaciones por Año
            </CardTitle>
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                {overallTrend > 0 ? (
                  <ArrowUpCircle className="text-green-600 dark:text-green-400" />
                ) : overallTrend < 0 ? (
                  <ArrowDownCircle className="text-red-600 dark:text-red-400" />
                ) : (
                  <TrendingUp className="text-yellow-600 dark:text-yellow-400" />
                )}
                <span className="text-sm font-medium text-green-700 dark:text-green-300">
                  {overallTrend > 0
                    ? "Tendencia positiva"
                    : overallTrend < 0
                      ? "Tendencia negativa"
                      : "Sin cambios significativos"}
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowTrendline(!showTrendline)}
                className="bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-700 dark:text-green-100 dark:hover:bg-green-600"
              >
                {showTrendline ? "Ocultar tendencia" : "Mostrar tendencia"}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {yearlyAverages.length > 0 ? (
              <ChartContainer
                config={{
                  average: {
                    label: "Promedio",
                    color: "hsl(142, 76%, 36%)",
                  },
                }}
                className="h-[400px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={yearlyAverages} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(142, 76%, 70%)" />
                    <XAxis
                      dataKey="year"
                      stroke="hsl(142, 76%, 36%)"
                      label={{ value: "Año", position: "insideBottomRight", offset: -5 }}
                    />
                    <YAxis
                      domain={[0, 100]}
                      tickFormatter={(tick) => `${tick}%`}
                      stroke="hsl(142, 76%, 36%)"
                      label={{
                        value: "Promedio de Calificaciones",
                        angle: -90,
                        position: "insideLeft",
                        style: { textAnchor: "middle" },
                      }}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <ReferenceLine y={70} label="Aprobado" stroke="hsl(142, 76%, 50%)" strokeDasharray="3 3" />
                    <Line
                      type="monotone"
                      dataKey="average"
                      stroke="hsl(142, 76%, 36%)"
                      strokeWidth={3}
                      dot={{ r: 6, fill: "hsl(142, 76%, 36%)" }}
                      activeDot={{ r: 8, fill: "hsl(142, 76%, 50%)" }}
                    />
                    {showTrendline && (
                      <Line
                        type="linear"
                        dataKey="average"
                        stroke="hsl(142, 76%, 50%)"
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        dot={false}
                      />
                    )}
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            ) : (
              <p className="text-center text-green-800 dark:text-green-100">No hay datos disponibles</p>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  )
}

