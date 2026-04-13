/**
 * ============================================================
 * MÓDULO: ReportesPage - Página de Reportes
 * ============================================================
 * Muestra gráficas y estadísticas generales del sistema:
 * - Tareas por estado
 * - Evaluaciones por área
 * - Productividad semanal
 * ============================================================
 */

import { BarChart3, PieChart, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import {
  Bar, BarChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip,
  PieChart as RechartsPie, Pie, Cell, Legend,
} from "recharts";
import { tasks, evaluations, areas, users } from "../data/mockData";

const tasksByStatus = [
  { name: "Pendientes", value: tasks.filter(t => t.estado === "pendiente").length },
  { name: "En proceso", value: tasks.filter(t => t.estado === "en_proceso").length },
  { name: "Finalizadas", value: tasks.filter(t => t.estado === "finalizada").length },
];

const PIE_COLORS = ["hsl(45, 93%, 47%)", "hsl(217, 91%, 60%)", "hsl(142, 71%, 45%)"];

const evalByArea = areas.map(area => {
  const areaUsers = users.filter(u => u.area_id === area.id).map(u => u.id);
  const areaEvals = evaluations.filter(e => areaUsers.includes(e.trabajador_id));
  const avg = areaEvals.length > 0
    ? parseFloat((areaEvals.reduce((s, e) => s + e.calificacion, 0) / areaEvals.length).toFixed(1))
    : 0;
  return { name: area.nombre, promedio: avg };
}).filter(a => a.promedio > 0);

const weeklyData = [
  { day: "Lun", completadas: 4 },
  { day: "Mar", completadas: 6 },
  { day: "Mié", completadas: 3 },
  { day: "Jue", completadas: 5 },
  { day: "Vie", completadas: 7 },
];

const ReportesPage = () => (
  <div className="space-y-6">
    <div className="flex items-center gap-3">
      <BarChart3 className="text-primary" size={28} />
      <h1 className="text-2xl font-bold text-foreground">Reportes</h1>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Tareas por estado - Pie */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-border rounded-2xl p-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <PieChart size={18} className="text-primary" />
          <h2 className="font-semibold text-foreground">Tareas por estado</h2>
        </div>
        <ResponsiveContainer width="100%" height={260}>
          <RechartsPie>
            <Pie data={tasksByStatus} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
              {tasksByStatus.map((_, i) => (
                <Cell key={i} fill={PIE_COLORS[i]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </RechartsPie>
        </ResponsiveContainer>
      </motion.div>

      {/* Evaluaciones promedio por área */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-card border border-border rounded-2xl p-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp size={18} className="text-primary" />
          <h2 className="font-semibold text-foreground">Evaluación promedio por área</h2>
        </div>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={evalByArea}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis domain={[0, 10]} tick={{ fontSize: 12 }} />
            <Tooltip />
            <Bar dataKey="promedio" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Tareas completadas por día */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-card border border-border rounded-2xl p-6 lg:col-span-2"
      >
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 size={18} className="text-primary" />
          <h2 className="font-semibold text-foreground">Tareas completadas por día (semana actual)</h2>
        </div>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={weeklyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="day" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Bar dataKey="completadas" fill="hsl(142, 71%, 45%)" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  </div>
);

export default ReportesPage;
