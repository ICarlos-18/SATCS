import { useAuth } from '../context/AuthContext';
import {
  Users,
  ClipboardList,
  Bell,
  BarChart3,
  CalendarDays,
  Clock,
  Newspaper,
  CheckCircle
} from 'lucide-react';

import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip
} from 'recharts';

import Calendar from 'react-calendar';
import { useState, useEffect } from 'react';

// 🔥 Firebase
import {
  getUsers,
  getTasks,
  getAnnouncements
} from '../services/firestore';

const chartData = [
  { day: 'Lun', productividad: 80 },
  { day: 'Mar', productividad: 90 },
  { day: 'Mié', productividad: 75 },
  { day: 'Jue', productividad: 85 },
  { day: 'Vie', productividad: 95 },
];

const DashboardPage = () => {
  const { currentUser } = useAuth();

  const [users, setUsers] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [announcements, setAnnouncements] = useState<any[]>([]);

  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [loading, setLoading] = useState(true);

  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  // ⏰ reloj
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // 🔥 cargar datos
  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersData = await getUsers();
        const tasksData = await getTasks();
        const announcementsData = await getAnnouncements();

        setUsers(Array.isArray(usersData) ? usersData : []);
        setTasks(Array.isArray(tasksData) ? tasksData : []);
        setAnnouncements(Array.isArray(announcementsData) ? announcementsData : []);
      } catch (error) {
        console.error("Error cargando datos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (!currentUser) return null;

  if (loading || !ready) {
    return <p className="text-center p-6">Cargando dashboard...</p>;
  }

  // 📊 cálculos seguros
  const activeUsers = users.filter(u => u?.activo).length;
  const activeTasks = tasks.filter(t => t?.estado !== 'finalizada').length;
  const completedTasks = tasks.filter(t => t?.estado === 'finalizada').length;

  const completedPct = tasks.length
    ? Math.round((completedTasks / tasks.length) * 100)
    : 0;

  const activeAnnouncements = announcements.filter(a => a?.activo).length;

  return (
    <div className="space-y-6">

      <h1 className="text-2xl font-bold">
        Bienvenido, {currentUser.nombre || 'Usuario'}
      </h1>

      {/* 📊 TARJETAS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card icon={<Users />} value={activeUsers} label="Trabajadores" />
        <Card icon={<ClipboardList />} value={activeTasks} label="Tareas activas" />
        <Card icon={<Bell />} value={activeAnnouncements} label="Avisos activos" />
        <Card icon={<BarChart3 />} value={`${completedPct}%`} label="Productividad" />
      </div>

      {/* 📅 + 📊 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* CALENDARIO */}
        <div className="rounded-xl border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <CalendarDays size={20} />
            <h3 className="font-semibold">Calendario y Hora</h3>
          </div>

          {ready && (
            <div className="flex justify-center">
              <Calendar
                onChange={(v) => v instanceof Date && setDate(v)}
                value={date}
              />
            </div>
          )}

          <div className="flex items-center gap-3 mt-4 p-3 rounded-lg bg-muted">
            <Clock size={20} />
            <div>
              <p className="text-lg font-mono font-bold">
                {time.toLocaleTimeString()}
              </p>
              <p className="text-xs">
                {date.toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* 📊 GRÁFICA */}
        <div className="rounded-xl border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 size={20} />
            <h3 className="font-semibold">Productividad semanal</h3>
          </div>

          <div className="h-64 w-full">
            {ready && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="productividad" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* 📢 AVISOS */}
      <div className="rounded-xl border bg-card p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Newspaper size={20} />
          <h3 className="font-semibold">Avisos recientes</h3>
        </div>

        <div className="space-y-3">
          {Array.isArray(announcements) &&
            announcements
              .filter(a => a?.activo)
              .map((a) => (
                <div
                  key={a?.id || Math.random()}
                  className="flex items-start gap-3 py-2 border-b"
                >
                  <CheckCircle size={16} />
                  <div>
                    <p className="text-sm font-medium">
                      {a?.titulo || 'Sin título'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {a?.fecha || 'Sin fecha'}
                    </p>
                  </div>
                </div>
              ))}
        </div>
      </div>

    </div>
  );
};

/* 🔥 CARD SEGURO */
const Card = ({ icon, value, label }: any) => (
  <div className="flex items-center gap-4 rounded-xl border bg-card p-5 shadow-sm">
    <div className="rounded-lg bg-primary/10 p-3 text-primary">
      {icon}
    </div>
    <div>
      <p className="text-2xl font-bold">{value ?? 0}</p>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  </div>
);

export default DashboardPage;