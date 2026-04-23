import type { ReactNode } from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AppSidebar from './AppSidebar';
import { LogOut, Sun, Moon, Menu } from 'lucide-react';
import { cn } from '../../lib/utils';

const roleLabels: Record<string, string> = {
  admin: 'Administrador',
  supervisor: 'Supervisor',
  trabajador: 'Trabajador',
};

export default function AppLayout({ children }: { children: ReactNode }) {
  const { currentUser, logout, loading } = useAuth();
  const navigate = useNavigate();

  // 🔥 SEPARAR ESTADOS (CLAVE)
  const [sidebarOpen, setSidebarOpen] = useState(false); // mobile
  const [collapsed, setCollapsed] = useState(false); // desktop

  // 🌙 Dark mode
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true';
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('darkMode', String(darkMode));
  }, [darkMode]);

  // 🔐 Redirección
  useEffect(() => {
    if (!loading && !currentUser) {
      navigate('/');
    }
  }, [currentUser, loading, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Cargando...</p>
      </div>
    );
  }

  if (!currentUser) return null;

  return (
    <div className="flex min-h-screen bg-background overflow-hidden">

      {/* 🔥 OVERLAY MOBILE */}
      {/* 🔥 SIDEBAR PRO (FIX DEFINITIVO) */}
    <div
      className={cn(
        "fixed lg:relative top-0 h-screen z-40 transition-all duration-300",

        // 📱 MOBILE (NO ocupa espacio)
        sidebarOpen ? "translate-x-0" : "-translate-x-full",

        // 💻 DESKTOP (SIEMPRE visible)
        "lg:translate-x-0",

        // 💻 WIDTH SOLO EN DESKTOP
        collapsed ? "lg:w-16" : "lg:w-64"
      )}
    >
      <AppSidebar
        collapsed={collapsed}
        onNavigateMobile={() => setSidebarOpen(false)}
      />
    </div>

      {/* CONTENIDO */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* HEADER */}
        <header className="sticky top-0 z-20 h-14 flex items-center justify-between px-4 border-b bg-card">

          <div className="flex items-center gap-3">

            {/* 📱 BOTÓN MOBILE */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg hover:bg-muted lg:hidden"
            >
              <Menu size={20} />
            </button>

            {/* 💻 BOTÓN DESKTOP */}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-2 rounded-lg hover:bg-muted hidden lg:block"
            >
              <Menu size={20} />
            </button>

            <span className="text-sm font-semibold hidden sm:inline">
              Sistema de Gestión de Trabajadores
            </span>
          </div>

          <div className="flex items-center gap-2">

            <span className="hidden sm:inline-flex px-3 py-1 rounded-full bg-primary/10 text-xs">
              {roleLabels[currentUser.rol] || 'Usuario'} — {currentUser.nombre} {currentUser.apellido}
            </span>

            {/* 🌙 Dark Mode */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg hover:bg-muted"
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* 🔓 Logout */}
            <button
              onClick={async () => {
                await logout();
                navigate('/');
              }}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm hover:bg-muted"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Salir</span>
            </button>

          </div>
        </header>

        {/* MAIN */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-6 max-w-7xl mx-auto">
            {children}
          </div>
        </main>

      </div>
    </div>
  );
}