/**
 * ============================================================
 * MÓDULO: DashboardPage - Panel Principal / Página de Inicio
 * ============================================================
 * Vista principal que se muestra después del login.
 * Muestra un resumen general del sistema con:
 * - Tarjetas de estadísticas (trabajadores, tareas, notificaciones)
 * - Calendario interactivo con reloj en tiempo real
 * - Gráfica de productividad semanal (usando Recharts)
 * - Empleados del mes (top 3)
 * - Avisos recientes del sistema
 *
 * Requerimientos cubiertos:
 * - RF_16: Consulta de historial de tareas (resumen)
 * - RNF_04: Interfaz intuitiva y fácil de usar
 * ============================================================
 */

import { useAuth } from '../context/AuthContext';
import { Users, ClipboardList, Bell, BarChart3, CalendarDays, Clock, Trophy, Newspaper, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useState, useEffect } from 'react';
import { users, tasks, announcements } from '../data/mockData';

/** Datos para la gráfica de productividad semanal */
const chartData = [
  { day: 'Lun', productividad: 80 },
  { day: 'Mar', productividad: 90 },
  { day: 'Mié', productividad: 75 },
  { day: 'Jue', productividad: 85 },
  { day: 'Vie', productividad: 95 },
];

/** Empleados destacados del mes (top 3) */
const employees = [
  { name: 'María González', area: 'Abarrotes', place: '1er' },
  { name: 'José Hernández', area: 'Frutas y Verduras', place: '2do' },
  { name: 'Laura Sánchez', area: 'Cajas', place: '3er' },
];

const DashboardPage = () => {
  const { currentUser } = useAuth();
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (!currentUser) return null;

  const activeUsers = users.filter(u => u.activo).length;
  const activeTasks = tasks.filter(t => t.estado !== 'finalizada').length;
  const pendingTasks = tasks.filter(t => t.estado === 'pendiente').length;
  const completedPct = Math.round((tasks.filter(t => t.estado === 'finalizada').length / tasks.length) * 100);

  const statsData = [
    { icon: Users, value: String(activeUsers), label: 'Trabajadores' },
    { icon: ClipboardList, value: String(activeTasks), label: 'Tareas activas' },
    { icon: Bell, value: String(announcements.filter(a => a.activo).length), label: 'Avisos activos' },
    { icon: BarChart3, value: `${completedPct}%`, label: 'Productividad' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Saludo */}
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-bold text-foreground"
      >
        Bienvenido, {currentUser.nombre}
      </motion.h1>

      {/* Tarjetas de estadísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsData.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="flex items-center gap-4 rounded-xl border border-border bg-card p-5 shadow-sm"
          >
            <div className="rounded-lg bg-primary/10 p-3 text-primary">
              <item.icon size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{item.value}</p>
              <p className="text-sm text-muted-foreground">{item.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Calendario + Gráfica */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Calendario y Reloj */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <CalendarDays size={20} className="text-primary" />
            <h3 className="font-semibold text-foreground">Calendario y Hora</h3>
          </div>

          <div className="flex justify-center [&_.react-calendar]:border-border [&_.react-calendar]:rounded-lg [&_.react-calendar]:bg-card [&_.react-calendar]:text-foreground [&_.react-calendar__tile--active]:!bg-primary [&_.react-calendar__tile--active]:!text-primary-foreground [&_.react-calendar__navigation__label]:text-foreground [&_.react-calendar__navigation__arrow]:text-muted-foreground [&_.react-calendar__tile]:rounded-md">
            <Calendar onChange={(v) => setDate(v as Date)} value={date} />
          </div>

          {/* Reloj digital */}
          <div className="flex items-center gap-3 mt-4 p-3 rounded-lg bg-muted">
            <Clock size={20} className="text-primary" />
            <div>
              <p className="text-lg font-mono font-bold text-foreground">
                {time.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </p>
              <p className="text-xs text-muted-foreground capitalize">
                {date.toLocaleDateString('es-MX', { weekday: 'long', month: 'long', day: 'numeric' })}
              </p>
            </div>
          </div>
        </div>

        {/* Gráfica de productividad */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 size={20} className="text-primary" />
            <h3 className="font-semibold text-foreground">Productividad semanal</h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="day" className="text-muted-foreground" tick={{ fontSize: 12 }} />
                <YAxis className="text-muted-foreground" tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="productividad" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Empleados del Mes */}
      <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Trophy size={20} className="text-accent" />
          <h3 className="font-semibold text-foreground">Empleados del Mes</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {employees.map((emp, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.15 }}
              className="flex flex-col items-center gap-2 p-4 rounded-lg bg-muted/50"
            >
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
                  {emp.name.charAt(0)}
                </div>
                <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {emp.place}
                </span>
              </div>
              <p className="text-sm font-medium text-foreground">{emp.name}</p>
              <p className="text-xs text-muted-foreground">{emp.area}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Avisos recientes */}
      <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Newspaper size={20} className="text-info" />
          <h3 className="font-semibold text-foreground">Avisos recientes</h3>
        </div>
        <div className="space-y-3">
          {announcements.filter(a => a.activo).map((a) => (
            <div key={a.id} className="flex items-start gap-3 py-2 border-b border-border last:border-0">
              <CheckCircle size={16} className="text-success mt-0.5 shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground">{a.titulo}</p>
                <p className="text-xs text-muted-foreground">{a.fecha}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
