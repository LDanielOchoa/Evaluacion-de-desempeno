import { Suspense } from "react"
import FormularioContent from "./formulario"

export default function FormularioPage() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <FormularioContent />
    </Suspense>
  )
}

