"use client"

import type React from "react"
import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ChevronLeft, ChevronRight, Search, Calendar, User, FileText, ThumbsUp, Lightbulb, Star } from "lucide-react"
import type { Evaluation } from "./types"

interface Props {
  evaluations: Evaluation[]
}

const ITEMS_PER_PAGE = 6

export function EvaluationSummary({ evaluations }: Props) {
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")

  const filteredAndSortedEvaluations = useMemo(() => {
    return evaluations
      .filter(
        (evaluation) =>
          evaluation.nombres_apellidos.toLowerCase().includes(searchTerm.toLowerCase()) ||
          evaluation.cedula.includes(searchTerm),
      )
      .sort((a, b) => {
        const dateA = new Date(a.fecha_evaluacion).getTime()
        const dateB = new Date(b.fecha_evaluacion).getTime()
        return sortOrder === "desc" ? dateB - dateA : dateA - dateB
      })
  }, [evaluations, searchTerm, sortOrder])

  const totalPages = Math.ceil(filteredAndSortedEvaluations.length / ITEMS_PER_PAGE)
  const paginatedEvaluations = filteredAndSortedEvaluations.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  )

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage)
  }

  const handleSortOrderChange = (value: string) => {
    setSortOrder(value as "asc" | "desc")
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            type="text"
            placeholder="Buscar por nombre o cédula"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={sortOrder} onValueChange={handleSortOrderChange}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Ordenar por fecha" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="desc">Más recientes primero</SelectItem>
            <SelectItem value="asc">Más antiguos primero</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentPage}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {paginatedEvaluations.map((evaluation) => (
            <EvaluationCard key={`${evaluation.cedula}-${evaluation.fecha_evaluacion}`} evaluation={evaluation} />
          ))}
        </motion.div>
      </AnimatePresence>

      <div className="flex justify-between items-center mt-8">
        <Button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          variant="outline"
          size="sm"
          className="flex items-center space-x-2"
        >
          <ChevronLeft size={16} />
          <span>Anterior</span>
        </Button>
        <span className="text-sm text-gray-600 dark:text-gray-300">
          Página {currentPage} de {totalPages}
        </span>
        <Button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          variant="outline"
          size="sm"
          className="flex items-center space-x-2"
        >
          <span>Siguiente</span>
          <ChevronRight size={16} />
        </Button>
      </div>
    </div>
  )
}

function EvaluationCard({ evaluation }: { evaluation: Evaluation }) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-600 p-4">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg font-semibold text-white">{evaluation.nombres_apellidos}</CardTitle>
            <p className="text-sm text-green-100">{evaluation.cargo}</p>
          </div>
          <Badge variant="outline" className="text-white border-white px-2 py-1">
            {evaluation.porcentaje_calificacion.toFixed(1)}%
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <Calendar size={14} className="mr-1" />
            {new Date(evaluation.fecha_evaluacion).toLocaleDateString()}
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                Ver detalles
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Detalles de la Evaluación</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <EvaluationDetail
                  icon={<User size={16} />}
                  title="Acuerdos de mejora (Colaborador)"
                  content={evaluation.acuerdos_mejora_desempeno_colaborador}
                />
                <EvaluationDetail
                  icon={<FileText size={16} />}
                  title="Acuerdos de mejora (Jefe)"
                  content={evaluation.acuerdos_mejora_desempeno_jefe}
                />
                <EvaluationDetail
                  icon={<Lightbulb size={16} />}
                  title="Necesidades de desarrollo"
                  content={evaluation.necesidades_desarrollo}
                />
                <EvaluationDetail
                  icon={<ThumbsUp size={16} />}
                  title="Aspectos positivos"
                  content={evaluation.aspectos_positivos}
                />
              </div>
              <div className="mt-6">
                <h4 className="font-medium text-green-700 dark:text-green-300 mb-2">Habilidades y Competencias</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <SkillRating title="Honestidad" value={evaluation.honestidad} />
                  <SkillRating title="Servicio" value={evaluation.servicio} />
                  <SkillRating title="Sencillez" value={evaluation.sencillez} />
                  <SkillRating title="Respeto" value={evaluation.respeto} />
                  <SkillRating title="Trabajo en equipo" value={evaluation.trabajo_equipo} />
                  <SkillRating title="Compromiso" value={evaluation.compromiso} />
                  <SkillRating title="Conocimiento del trabajo" value={evaluation.conocimiento_trabajo} />
                  <SkillRating title="Productividad" value={evaluation.productividad} />
                  <SkillRating title="Cumple sistema de gestión" value={evaluation.cumple_sistema_gestion} />
                  <SkillRating title="Cumple sistema de gestión" value={evaluation.tarea} />
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <p className="text-sm text-gray-600 dark:text-gray-300 truncate">
                {evaluation.acuerdos_mejora_desempeno_colaborador}
              </p>
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs">{evaluation.acuerdos_mejora_desempeno_colaborador}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <div className="mt-4 flex flex-wrap gap-2">
          <SkillBadge title="Honestidad" value={evaluation.honestidad} />
          <SkillBadge title="Servicio" value={evaluation.servicio} />
          <SkillBadge title="Sencillez" value={evaluation.sencillez} />
        </div>
      </CardContent>
    </Card>
  )
}

function EvaluationDetail({ icon, title, content }: { icon: React.ReactNode; title: string; content: string }) {
  return (
    <div className="flex items-start space-x-2 text-sm">
      <div className="flex-shrink-0 mt-1">{icon}</div>
      <div>
        <h4 className="font-medium text-green-700 dark:text-green-300">{title}</h4>
        <p className="text-gray-600 dark:text-gray-300">{content}</p>
      </div>
    </div>
  )
}

function SkillRating({ title, value }: { title: string; value: number }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm font-medium text-gray-600 dark:text-gray-300">{title}</span>
      <div className="flex items-center">
        {[1, 2, 3, 4].map((star) => (
          <Star
            key={star}
            size={16}
            className={star <= value ? "text-yellow-400 fill-current" : "text-gray-300 dark:text-gray-600"}
          />
        ))}
      </div>
    </div>
  )
}

function SkillBadge({ title, value }: { title: string; value: number }) {
  const colors = ["bg-red-100 text-red-800", "bg-yellow-100 text-yellow-800", "bg-green-100 text-green-800"]
  const colorIndex = Math.min(Math.floor(value / 2), 2)

  return (
    <Badge variant="outline" className={`${colors[colorIndex]} border-transparent`}>
      {title}: {value}
    </Badge>
  )
}

