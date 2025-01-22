export interface UserData {
    CEDULA: number
    NOMBRE: string
    CARGO: string
    CENTRO_DE_COSTO: string
    LIDER_EVALUADOR: string
    CARGO_DE_LIDER_EVALUADOR: string
    ESTADO: string
    ANO_INGRESO: number
    MES_INGRESO: string
    ANOS: number
    ANTIGUEDAD: string
  }
  
  export interface FormData {
    datos: {
      nombres: string
      cedula: string
      cargo: string
      jefe: string
      cargoJefe: string
      area: string
      antiguedad: string
      mesIngreso: string
      anoIngreso: string
    }
    valores: {
      compromiso: number
      honestidad: number
      respeto: number
      sencillez: number
    }
    acuerdos: {
      colaborador_acuerdos: string
      jefe_acuerdos: string
      desarrollo_necesidades: string
      aspectos_positivos: string
    }
  }
  
  