import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { motion, AnimatePresence } from "framer-motion"
import {
  Calendar,
  User,
  Briefcase,
  Star,
  Award,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clipboard,
  MessageSquare,
} from "lucide-react"
import { Progress } from "@/components/ui/progress"

interface DetailModalProps {
  isOpen: boolean
  onClose: () => void
  item: any
}

export function DetailModal({ isOpen, onClose, item }: DetailModalProps) {
  if (!item) return null

  const getStatusColor = (porcentaje: number) => {
    if (porcentaje >= 90) return "text-green-500"
    if (porcentaje >= 70) return "text-yellow-500"
    return "text-red-500"
  }

  const getStatusIcon = (porcentaje: number) => {
    if (porcentaje >= 90) return <CheckCircle className="h-6 w-6 text-green-500" />
    if (porcentaje >= 70) return <AlertCircle className="h-6 w-6 text-yellow-500" />
    return <XCircle className="h-6 w-6 text-red-500" />
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent className="sm:max-w-[600px] bg-white shadow-2xl rounded-2xl">
            <DialogHeader>
              <DialogTitle className="text-3xl font-bold text-green-700">Detalles de la Evaluación</DialogTitle>
              <DialogDescription className="text-lg text-green-600">
                Información completa de la evaluación seleccionada
              </DialogDescription>
            </DialogHeader>
            <ScrollArea className="mt-6 max-h-[70vh] pr-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-8"
              >
                <div className="bg-gradient-to-r from-green-100 to-green-200 p-6 rounded-xl shadow-md">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <User className="h-10 w-10 text-green-600" />
                      <div>
                        <h3 className="font-semibold text-2xl text-green-800">{item.nombre}</h3>
                        <p className="text-lg text-green-600">{item.cargo}</p>
                      </div>
                    </div>
                    {getStatusIcon(item.porcentaje_calificacion)}
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="bg-white p-3 rounded-lg flex items-center space-x-3">
                      <Calendar className="h-6 w-6 text-blue-600" />
                      <span className="text-lg font-medium text-blue-800">
                        {new Date(item.fecha).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="bg-white p-3 rounded-lg flex items-center space-x-3">
                      <Star className="h-6 w-6 text-yellow-600" />
                      <div>
                        <span className="text-lg font-medium text-yellow-800">{item.puntaje_total} puntos</span>
                        <span className="text-sm text-yellow-600 block">({item.porcentaje_calificacion}%)</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-purple-100 p-6 rounded-xl shadow-md">
                  <h4 className="font-semibold text-xl text-purple-800 mb-3 flex items-center">
                    <Award className="h-6 w-6 mr-2" />
                    Acción Recomendada
                  </h4>
                  <p className="text-lg text-purple-700">{item.accion}</p>
                </div>

                <div className="bg-blue-100 p-6 rounded-xl shadow-md">
                  <h4 className="font-semibold text-xl text-blue-800 mb-3 flex items-center">
                    <Clipboard className="h-6 w-6 mr-2" />
                    Desglose de Puntuación
                  </h4>
                  <div className="space-y-4">
                    {Object.entries(item.desglose_puntuacion || {}).map(([categoria, puntos]: [string, any]) => (
                      <div key={categoria}>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-blue-700">{categoria}</span>
                          <span className="font-medium text-blue-800">{puntos} puntos</span>
                        </div>
                        <Progress
                          value={puntos}
                          max={100}
                          className="h-2 bg-blue-200"
                          indicatorClassName="bg-blue-500"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gray-100 p-6 rounded-xl shadow-md">
                  <h4 className="font-semibold text-xl text-gray-800 mb-3 flex items-center">
                    <MessageSquare className="h-6 w-6 mr-2" />
                    Comentarios
                  </h4>
                  <p className="text-lg text-gray-700">{item.comentarios || "No hay comentarios disponibles."}</p>
                </div>
              </motion.div>
            </ScrollArea>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  )
}

