import { Suspense } from "react"
import FormularioContent from "./page"

export default function FormularioPage() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <FormularioContent />
    </Suspense>
  )
}

