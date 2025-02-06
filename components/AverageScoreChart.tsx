"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell, LabelList } from "recharts"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Evaluation {
  id: string
  name: string
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
  const [isExpanded, setIsExpanded] = useState(false)
  const [selectedCriteria, setSelectedCriteria] = useState<string | null>(null)
  const [averages, setAverages] = useState<Array<{ name: string; average: number; key: string }>>([])
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    const calculatedAverages = calculateAverages()
    setAverages(calculatedAverages)
  }, [evaluations]) //Corrected dependency array

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
      key: key,
    }))
  }

  const colors = [
    "#064e3b", // Dark Green
    "#065f46", // Forest Green
    "#047857", // Emerald
    "#059669", // Green
    "#10b981", // Light Green
    "#34d399", // Mint
    "#6ee7b7", // Pale Green
    "#a7f3d0", // Very Pale Green
    "#d1fae5", // Almost White Green
  ]

  const getPersonsWithScore = (criteria: string) => {
    return evaluations
      .filter((evaluation) => evaluation[criteria as keyof Evaluation] >= 3)
      .sort((a, b) => b[criteria as keyof Evaluation] - a[criteria as keyof Evaluation])
  }

  if (!isClient) {
    return <div>Loading...</div>
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-4xl mx-auto"
    >
      <Card className="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900 dark:to-emerald-800 shadow-lg rounded-lg overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-700 text-white p-6">
          <CardTitle className="text-2xl font-bold">Promedio de Calificaciones por Criterio</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <AnimatePresence>
            <motion.div
              key={isExpanded ? "expanded" : "collapsed"}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <ResponsiveContainer width="100%" height={isExpanded ? 600 : 400}>
                <BarChart data={averages} layout="vertical" margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <XAxis
                    type="number"
                    domain={[0, 4]}
                    tickCount={5}
                    tick={{ fill: "#065f46" }}
                    axisLine={{ stroke: "#059669" }}
                  />
                  <YAxis
                    dataKey="name"
                    type="category"
                    width={150}
                    tick={{ fill: "#065f46" }}
                    axisLine={{ stroke: "#059669" }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(236, 253, 245, 0.9)",
                      borderRadius: "0.5rem",
                      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                      border: "1px solid #10b981",
                    }}
                    labelStyle={{ fontWeight: "bold", color: "#065f46" }}
                  />
                  <Bar dataKey="average" animationBegin={0} animationDuration={2000}>
                    {averages.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={colors[index % colors.length]}
                        className="cursor-pointer hover:opacity-80 transition-opacity duration-200"
                        onClick={() => setSelectedCriteria(entry.key)}
                      />
                    ))}
                    <LabelList dataKey="average" position="right" fill="#065f46" />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </motion.div>
          </AnimatePresence>
          <motion.div
            className="flex justify-center mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Button
              variant="outline"
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center space-x-2 text-green-700 hover:text-green-800 hover:bg-green-100 transition-colors duration-200 border-green-600"
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="w-4 h-4" />
                  <span>Mostrar menos</span>
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4" />
                  <span>Mostrar más</span>
                </>
              )}
            </Button>
          </motion.div>
        </CardContent>
      </Card>

      <Dialog open={!!selectedCriteria} onOpenChange={() => setSelectedCriteria(null)}>
        <DialogContent className="bg-green-50 dark:bg-green-900 sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-green-700 dark:text-green-300">
              Personas con alta calificación en{" "}
              {selectedCriteria && averages.find((avg) => avg.key === selectedCriteria)?.name}
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="mt-4 h-[300px] rounded-md border border-green-200 dark:border-green-700 p-4">
            {selectedCriteria &&
              getPersonsWithScore(selectedCriteria).map((person, index) => (
                <div
                  key={person.id}
                  className="flex items-center space-x-4 py-2 border-b border-green-200 dark:border-green-700 last:border-b-0"
                >
                  <Avatar className="h-10 w-10 border-2 border-green-500">
                    <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${person.name}`} />
                    <AvatarFallback className="bg-green-200 text-green-800">
                      {person.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium text-green-800 dark:text-green-200">{person.name}</p>
                    <p className="text-xs text-green-600 dark:text-green-400">
                      Calificación: {person[selectedCriteria as keyof Evaluation]}
                    </p>
                  </div>
                </div>
              ))}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}

