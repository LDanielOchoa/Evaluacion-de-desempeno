import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { motion } from "framer-motion";

interface Evaluation {
  anio: number;
  porcentaje_calificacion: number;
}

interface Props {
  evaluations: Evaluation[];
}

export function YearlyProgressChart({ evaluations }: Props) {
  const calculateYearlyAverages = () => {
    const yearlyData: { [key: number]: { total: number; count: number } } = {};
    evaluations.forEach((evaluation) => {
      if (!yearlyData[evaluation.anio]) {
        yearlyData[evaluation.anio] = { total: 0, count: 0 };
      }
      yearlyData[evaluation.anio].total += evaluation.porcentaje_calificacion;
      yearlyData[evaluation.anio].count += 1;
    });

    return Object.entries(yearlyData)
      .map(([year, data]) => ({
        year: Number(year),
        average: Number((data.total / data.count).toFixed(2)),
      }))
      .sort((a, b) => a.year - b.year);
  };

  const yearlyAverages = calculateYearlyAverages();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <Card>
        <CardHeader>
          <CardTitle>Evolución de Calificaciones por Año</CardTitle>
        </CardHeader>
        <CardContent>
          {yearlyAverages.length > 0 ? (
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={yearlyAverages} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" label={{ value: "Año", position: "insideBottomRight", offset: -5 }} />
                <YAxis
                  domain={[0, 100]}
                  tickFormatter={(tick) => `${tick}%`}
                  label={{ value: "Promedio de Calificaciones", angle: -90, position: "insideLeft" }}
                />
                <Tooltip formatter={(value) => `${value}%`} />
                <Line
                  type="monotone"
                  dataKey="average"
                  stroke="#15803d"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p>No hay datos disponibles</p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
