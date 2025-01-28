"use client"

import { useEffect, useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2 } from "lucide-react"

interface Evaluacion {
  id: number
  evaluado_nombre: string
  fecha: string
  cargo_evaluado: string
  resultados: {
    [key: string]: any
  }
}

export function EvaluationResults() {
  const [evaluaciones, setEvaluaciones] = useState<Evaluacion[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchEvaluaciones = async () => {
      try {
        const response = await fetch("http://localhost:5000/evaluaciones", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })

        if (!response.ok) {
          throw new Error("Error al cargar evaluaciones")
        }

        const data = await response.json()
        setEvaluaciones(data.evaluaciones)
      } catch (err) {
        setError("No se pudieron cargar las evaluaciones")
      } finally {
        setLoading(false)
      }
    }

    fetchEvaluaciones()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-red-500 text-center">{error}</p>
        </CardContent>
      </Card>
    )
  }

  if (evaluaciones.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">No hay evaluaciones disponibles</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Evaluaciones Realizadas</CardTitle>
        <CardDescription>Lista de evaluaciones según su rol y permisos</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Evaluado</TableHead>
                <TableHead>Cargo</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {evaluaciones.map((evaluacion) => (
                <TableRow key={evaluacion.id}>
                  <TableCell className="font-medium">{evaluacion.evaluado_nombre}</TableCell>
                  <TableCell>{evaluacion.cargo_evaluado}</TableCell>
                  <TableCell>{new Date(evaluacion.fecha).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Badge>Completada</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}

