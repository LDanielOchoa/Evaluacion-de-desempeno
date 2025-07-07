"use client"

import { useState, useEffect } from "react"
import { useUser } from "../app/contexts/userContexts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableHead as TableHeaderCell } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationEllipsis,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination"

interface HistorialItem {
  id: number
  nombre: string
  cargo: string
  fecha: string
  accion: string
  puntaje_total: number
  porcentaje_calificacion: string
}

interface HistorialResponse {
  historial: HistorialItem[]
  total_pages: number
  current_page: number
  total_items: number
}

export default function HistorialViewer() {
  const { userData } = useUser()
  const [historial, setHistorial] = useState<HistorialItem[]>([])
  useEffect(() => {
    const fetchHistorial = async () => {
      if (!userData?.CEDULA) return

      try {
        // Cargar datos de evaluaciones
        const response = await fetch('/data.json')
        const evaluaciones = await response.json()
        
        // Filtrar evaluaciones por cédula
        const evaluacionesUsuario = evaluaciones
          .filter((evaluacion: any) => evaluacion.cedula.toString() === userData.CEDULA.toString())
        
        // Obtener el año más reciente de las evaluaciones del usuario
        const añosDisponibles = [...new Set(evaluacionesUsuario.map((evaluacion: any) => 
          evaluacion.anio || new Date(evaluacion.fecha_evaluacion).getFullYear()
        ))]
        const añoMásReciente = Math.max(...añosDisponibles.map(Number))
        
        // Filtrar solo las evaluaciones del año más reciente
        const evaluacionesDelÚltimoAño = evaluacionesUsuario.filter((evaluacion: any) => {
          const añoEvaluacion = evaluacion.anio || new Date(evaluacion.fecha_evaluacion).getFullYear()
          return añoEvaluacion === añoMásReciente
        })
        
        // Mapear las evaluaciones del último año
        const evaluacionesFormateadas = evaluacionesDelÚltimoAño.map((evaluacion: any, index: number) => ({
          id: index + 1,
          nombre: evaluacion.nombres_apellidos || userData.NOMBRE,
          cargo: evaluacion.cargo || userData.CARGO,
          fecha: evaluacion.fecha_evaluacion || new Date().toISOString().split('T')[0],
          accion: "Evaluación de Desempeño",
          puntaje_total: evaluacion.total_puntos || 0,
          porcentaje_calificacion: `${evaluacion.porcentaje_calificacion}%`
        }))
        
        // Ordenar por fecha descendente
        evaluacionesFormateadas.sort((a: any, b: any) => 
          new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
        )
        
        setHistorial(evaluacionesFormateadas)
      } catch (error) {
        console.error("Error al cargar el historial:", error)
      }
    }

    fetchHistorial()
  }, [userData])

  if (!userData) {
    return <div>Cargando...</div>
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Historial de {userData.CENTRO_DE_COSTO}</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Cargo</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Acción</TableHead>
              <TableHead>Puntaje Total</TableHead>
              <TableHead>Porcentaje Calificación</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {historial.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.nombre}</TableCell>
                <TableCell>{item.cargo}</TableCell>
                <TableCell>{item.fecha}</TableCell>
                <TableCell>{item.accion}</TableCell>
                <TableCell>{item.puntaje_total}</TableCell>
                <TableCell>{item.porcentaje_calificacion}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {/* Ya no necesitamos paginación ya que mostramos todos los resultados */}
      </CardContent>
    </Card>
  )
}

