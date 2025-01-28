import React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Evaluation {
  nombres_apellidos: string
  porcentaje_calificacion: number
  cargo: string
  compromiso_pasion_entrega: number
  honestidad: number
  respeto: number
  sencillez: number
  servicio: number
  trabajo_equipo: number
  conocimiento_trabajo: number
  productividad: number
  cumple_sistema_gestion: number
}

interface ScorePopupProps {
  isOpen: boolean
  onClose: () => void
  area: string
  year: number
  bestScores: Evaluation[]
  worstScores: Evaluation[]
}

export function ScorePopup({ isOpen, onClose, area, year, bestScores, worstScores }: ScorePopupProps) {
  const renderScoreTable = (scores: Evaluation[]) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nombre</TableHead>
          <TableHead>Cargo</TableHead>
          <TableHead>Calificación</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {scores.map((score, index) => (
          <TableRow key={index}>
            <TableCell>{score.nombres_apellidos}</TableCell>
            <TableCell>{score.cargo}</TableCell>
            <TableCell>{score.porcentaje_calificacion.toFixed(2)}%</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )

  const renderDetailedScoreTable = (scores: Evaluation[]) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nombre</TableHead>
          <TableHead>Compromiso</TableHead>
          <TableHead>Honestidad</TableHead>
          <TableHead>Respeto</TableHead>
          <TableHead>Sencillez</TableHead>
          <TableHead>Servicio</TableHead>
          <TableHead>Trabajo en Equipo</TableHead>
          <TableHead>Conocimiento</TableHead>
          <TableHead>Productividad</TableHead>
          <TableHead>Sistema de Gestión</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {scores.map((score, index) => (
          <TableRow key={index}>
            <TableCell>{score.nombres_apellidos}</TableCell>
            <TableCell>{score.compromiso_pasion_entrega}</TableCell>
            <TableCell>{score.honestidad}</TableCell>
            <TableCell>{score.respeto}</TableCell>
            <TableCell>{score.sencillez}</TableCell>
            <TableCell>{score.servicio}</TableCell>
            <TableCell>{score.trabajo_equipo}</TableCell>
            <TableCell>{score.conocimiento_trabajo}</TableCell>
            <TableCell>{score.productividad}</TableCell>
            <TableCell>{score.cumple_sistema_gestion}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[90vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Puntajes para {area} - Año {year}
          </DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="best" className="w-full">
          <TabsList>
            <TabsTrigger value="best">Mejores Puntajes</TabsTrigger>
            <TabsTrigger value="worst">Peores Puntajes</TabsTrigger>
          </TabsList>
          <TabsContent value="best">
            <Tabs defaultValue="summary">
              <TabsList>
                <TabsTrigger value="summary">Resumen</TabsTrigger>
                <TabsTrigger value="detailed">Detallado</TabsTrigger>
              </TabsList>
              <TabsContent value="summary">{renderScoreTable(bestScores)}</TabsContent>
              <TabsContent value="detailed">{renderDetailedScoreTable(bestScores)}</TabsContent>
            </Tabs>
          </TabsContent>
          <TabsContent value="worst">
            <Tabs defaultValue="summary">
              <TabsList>
                <TabsTrigger value="summary">Resumen</TabsTrigger>
                <TabsTrigger value="detailed">Detallado</TabsTrigger>
              </TabsList>
              <TabsContent value="summary">{renderScoreTable(worstScores)}</TabsContent>
              <TabsContent value="detailed">{renderDetailedScoreTable(worstScores)}</TabsContent>
            </Tabs>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

