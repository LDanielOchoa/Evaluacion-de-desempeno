"use client"

import React, { useState, useEffect, useCallback, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Star,
  Send,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  X,
  Award,
  ThumbsUp,
  Frown,
  ChevronDown,
  ChevronUp,
  Calendar,
} from "lucide-react"
import confetti from "canvas-confetti"
import { useUser } from "../contexts/userContexts"

// ... (previous type definitions remain the same)

export default function CorporateEvaluationForm() {
  const router = useRouter()
  const { userData } = useUser()
  const [isLoading, setIsLoading] = useState(false)
  const [currentSection, setCurrentSection] = useState(0)
  const [showSuccess, setShowSuccess] = useState(false)
  const [formData, setFormData] = useState<FormData>(() => {
    // Check if there's form data in the URL
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search)
      const formDataParam = urlParams.get("formData")
      if (formDataParam) {
        return JSON.parse(formDataParam)
      }
    }

    // If no form data in URL, use default values
    return {
      historial: {},
      datos: {
        nombres: userData?.NOMBRE || "",
        cedula: userData?.CEDULA?.toString() || "",
        cargo: userData?.CARGO || "",
        jefe: userData?.LIDER_EVALUADOR || "",
        cargoJefe: userData?.CARGO_DE_LIDER_EVALUADOR || "",
        area: userData?.CENTRO_DE_COSTO || "",
      },
      valores: {
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
      acuerdos: {
        colaborador_acuerdos: "",
        jefe_acuerdos: "",
        desarrollo_necesidades: "",
        aspectos_positivos: "",
      },
    }
  })
  const [evaluationHistory, setEvaluationHistory] = useState<EvaluationHistory[]>([])

  useEffect(() => {
    if (!userData && !formData.datos.cedula) {
      router.push("/")
      return
    }

    fetchEvaluationHistory(formData.datos.cedula || userData?.CEDULA?.toString())
  }, [userData, router, formData.datos.cedula])

  const fetchEvaluationHistory = useCallback(async (cedula: string) => {
    try {
      // Cargar datos de evaluaciones
      const response = await fetch('/data.json')
      const evaluaciones = await response.json()
      
      // Filtrar evaluaciones por cédula
      const historialEvaluaciones = evaluaciones
        .filter((evaluacion: any) => evaluacion.cedula.toString() === cedula)
        .map((evaluacion: any) => ({
          fecha_evaluacion: evaluacion.fecha_evaluacion || new Date().toISOString().split('T')[0],
          anio: new Date(evaluacion.fecha_evaluacion).getFullYear() || 2024,
          cargo: evaluacion.cargo,
          compromiso: evaluacion.compromiso_pasion_entrega || 0,
          honestidad: evaluacion.honestidad || 0,
          respeto: evaluacion.respeto || 0,
          sencillez: evaluacion.sencillez || 0,
          servicio: evaluacion.servicio || 0,
          trabajo_equipo: evaluacion.trabajo_equipo || 0,
          conocimiento_trabajo: evaluacion.conocimiento_trabajo || 0,
          productividad: evaluacion.productividad || 0,
          cumple_sistema_gestion: evaluacion.cumple_sistema_gestion || 0,
          total_puntos: evaluacion.total_puntos || 0,
          porcentaje_calificacion: `${evaluacion.porcentaje_calificacion}%`,
          acuerdos_mejora_desempeno_colaborador: evaluacion.acuerdos_mejora_desempeno_colaborador || "",
          acuerdos_mejora_desempeno_jefe: evaluacion.acuerdos_mejora_desempeno_jefe || "",
          necesidades_desarrollo: evaluacion.necesidades_desarrollo || "",
          aspectos_positivos: evaluacion.aspectos_positivos || ""
        }))
      
      setEvaluationHistory(historialEvaluaciones)
    } catch (error) {
      console.error("Error al cargar el historial:", error)
    }
  }, [])

  // ... (rest of the component code remains the same)

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-green-50 via-mint-100 to-green-50 p-2 sm:p-4 md:p-8 flex items-center justify-center relative overflow-hidden">
      {/* ... (rest of the JSX remains the same) */}
    </div>
  )
}

