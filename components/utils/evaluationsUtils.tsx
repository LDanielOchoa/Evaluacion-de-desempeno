import type { Evaluation } from "../types/evaluations"

export const calculateAverages = (evaluations: Evaluation[], field: keyof Evaluation) => {
  const totals: { [key: string]: { sum: number; count: number } } = {}

  evaluations.forEach((evaluation) => {
    if (!totals[evaluation.area_jefe_pertenencia]) {
      totals[evaluation.area_jefe_pertenencia] = { sum: 0, count: 0 }
    }
    totals[evaluation.area_jefe_pertenencia].sum += Number(evaluation[field])
    totals[evaluation.area_jefe_pertenencia].count++
  })

  return Object.entries(totals)
    .map(([area, data]) => ({
      area,
      average: Number((data.sum / data.count).toFixed(2)),
    }))
    .sort((a, b) => b.average - a.average)
}

export const getYearlyAverages = (evaluations: Evaluation[]) => {
  const yearlyData: { [key: string]: { [key: string]: number } } = {}

  evaluations.forEach((evaluation) => {
    if (!yearlyData[evaluation.anio]) {
      yearlyData[evaluation.anio] = {}
    }
    if (!yearlyData[evaluation.anio][evaluation.area_jefe_pertenencia]) {
      yearlyData[evaluation.anio][evaluation.area_jefe_pertenencia] = 0
    }
    yearlyData[evaluation.anio][evaluation.area_jefe_pertenencia] += evaluation.porcentaje_calificacion
  })

  return Object.entries(yearlyData).map(([year, areas]) => ({
    year,
    ...Object.entries(areas).reduce(
      (acc, [area, total]) => {
        acc[area] = Number(
          (total / evaluations.filter((e) => e.anio === year && e.area_jefe_pertenencia === area).length).toFixed(2),
        )
        return acc
      },
      {} as { [key: string]: number },
    ),
  }))
}

export const getTopPerformers = (evaluations: Evaluation[], limit = 5) => {
  return evaluations.sort((a, b) => b.porcentaje_calificacion - a.porcentaje_calificacion).slice(0, limit)
}

export const getLowPerformers = (evaluations: Evaluation[], limit = 5) => {
  return evaluations.sort((a, b) => a.porcentaje_calificacion - b.porcentaje_calificacion).slice(0, limit)
}

