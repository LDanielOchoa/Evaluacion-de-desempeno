export interface Evaluation {
  // Datos personales
  nombres_apellidos: string
  cedula: string
  cargo: string
  area_jefe_pertenencia: string
  
  // Fechas y periodo
  fecha_evaluacion: string
  anio: number // Siempre será number para cálculos
  
  // Valores corporativos
  compromiso_pasion_entrega: number
  compromiso?: number // Campo alternativo para compatibilidad
  honestidad: number
  respeto: number
  sencillez: number
  servicio: number
  trabajo_equipo: number
  conocimiento_trabajo: number
  productividad: number
  cumple_sistema_gestion: number
  
  // Resultados
  total_puntos: number
  porcentaje_calificacion: number
  
  // Acuerdos y comentarios
  acuerdos_mejora_desempeno_colaborador: string
  acuerdos_mejora_desempeno_jefe: string
  necesidades_desarrollo: string
  aspectos_positivos: string
  
  // Campos adicionales para el panel de admin
  departamento: string // Requerido para el panel de admin
}
  
  