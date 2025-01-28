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
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    const fetchHistorial = async () => {
      if (!userData?.CEDULA) return

      try {
        const response = await fetch(
          `https://evaluacion-de-desempeno.onrender.com/historial?cedula=${userData.CEDULA}&page=${currentPage}&per_page=10`,
        )
        const data: HistorialResponse = await response.json()
        setHistorial(data.historial)
        setTotalPages(data.total_pages)
      } catch (error) {
        console.error("Error fetching historial:", error)
      }
    }

    fetchHistorial()
  }, [userData, currentPage])

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

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
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
      </CardContent>
    </Card>
  )
}

