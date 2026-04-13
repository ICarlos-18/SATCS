import { useAuth } from '../../context/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, Building2, ClipboardList, Star,
  ShieldQuestion, Megaphone, Clock, BarChart3
} from 'lucide-react';
import { cn } from '../../lib/utils';

// ✅ Props del Sidebar
type SidebarProps = {
  collapsed?: boolean;
  onToggle?: () => void;
};

// 📋 Navegación por rol
const navItems: any = {
  admin: [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { label: 'Usuarios', icon: Users, path: '/usuarios' },
    { label: 'Áreas', icon: Building2, path: '/areas' },
    { label: 'Tareas', icon: ClipboardList, path: '/tareas' },
    { label: 'Evaluaciones', icon: Star, path: '/evaluaciones' },
    { label: 'Sugerencias', icon: ShieldQuestion, path: '/sugerencias' },
    { label: 'Avisos', icon: Megaphone, path: '/avisos' },
    { label: 'Horarios', icon: Clock, path: '/horarios' },
    { label: 'Reportes', icon: BarChart3, path: '/reportes' },
  ],
  supervisor: [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { label: 'Tareas', icon: ClipboardList, path: '/tareas' },
  ],
  trabajador: [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  ],
};

export default function AppSidebar({ collapsed = false }: SidebarProps) {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (!currentUser) return null;

  const items = navItems[currentUser.rol] || [];

  return (
    <aside
      className={cn(
        "flex flex-col bg-card border-r h-screen transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* 🔝 HEADER */}
      <div className="flex items-center gap-3 px-4 h-14 border-b">
        <div className="w-8 h-8 bg-primary flex items-center justify-center text-white rounded">
          C
        </div>

        {!collapsed && (
          <div>
            <h1 className="font-bold text-sm">Chedraui</h1>
            <p className="text-xs text-muted-foreground">Sucursal 601</p>
          </div>
        )}
      </div>

      {/* 📋 NAV */}
      <nav className="flex-1 p-2 space-y-1">
        {items.map((item: any) => {
          const active = location.pathname === item.path;

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 rounded transition",
                active
                  ? "bg-primary text-white"
                  : "hover:bg-muted"
              )}
            >
              <item.icon size={18} />

              {/* 👇 Texto oculto si está colapsado */}
              {!collapsed && <span>{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* 👤 FOOTER */}
      <div className="p-3 border-t">
        {!collapsed ? (
          <p className="text-xs">
            {currentUser.nombre} {currentUser.apellido}
          </p>
        ) : (
          <p className="text-xs text-center">👤</p>
        )}
      </div>
    </aside>
  );
}   