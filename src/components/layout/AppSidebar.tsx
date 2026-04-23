import { useAuth } from '../../context/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, Building2, ClipboardList, Star,
  ShieldQuestion, Megaphone, Clock, BarChart3
} from 'lucide-react';
import { cn } from '../../lib/utils';

type SidebarProps = {
  collapsed?: boolean;
  onNavigateMobile?: () => void; // 🔥 NUEVO
};

const menuItems = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard', roles: ['admin', 'supervisor', 'trabajador'] },
  { label: 'Usuarios', icon: Users, path: '/usuarios', roles: ['admin'] },
  { label: 'Áreas', icon: Building2, path: '/areas', roles: ['admin'] },
  { label: 'Tareas', icon: ClipboardList, path: '/tareas', roles: ['admin', 'supervisor', 'trabajador'] },
  { label: 'Evaluaciones', icon: Star, path: '/evaluaciones', roles: ['admin', 'supervisor'] },
  { label: 'Sugerencias', icon: ShieldQuestion, path: '/sugerencias', roles: ['admin', 'supervisor', 'trabajador'] },
  { label: 'Avisos', icon: Megaphone, path: '/avisos', roles: ['admin', 'supervisor', 'trabajador'] },
  { label: 'Horarios', icon: Clock, path: '/horarios', roles: ['admin', 'supervisor', 'trabajador'] },
  { label: 'Reportes', icon: BarChart3, path: '/reportes', roles: ['admin'] },
];

export default function AppSidebar({ collapsed = false, onNavigateMobile }: SidebarProps) {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (!currentUser) return null;

  const items = menuItems.filter(item =>
    item.roles.includes(currentUser.rol)
  );

  return (
    <aside
      className={cn(
        "flex flex-col bg-card border-r h-screen transition-all duration-300",
        collapsed ? "w-16" : "w-64" // 🔥 AHORA SÍ CAMBIA
      )}
    >
      {/* HEADER */}
      <div className="flex items-center gap-3 px-4 h-14 border-b">
        <div className="w-8 h-8 bg-primary flex items-center justify-center text-white rounded">
          C
        </div>

        {/* 🔥 TEXTO OCULTO SIN ROMPER */}
        {!collapsed && (
          <div>
            <h1 className="font-bold text-sm">Chedraui</h1>
            <p className="text-xs text-muted-foreground">Sucursal 601</p>
          </div>
        )}
      </div>

      {/* NAV */}
      <nav className="flex-1 p-2 space-y-1">
        {items.map((item) => {
          const active = location.pathname.startsWith(item.path);

          return (
            <button
              key={item.path}
              onClick={() => {
                navigate(item.path);
                onNavigateMobile?.(); // 🔥 CIERRA EN MOBILE
              }}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 rounded transition text-sm",
                active
                  ? "bg-primary text-white"
                  : "hover:bg-muted text-foreground",
                collapsed && "justify-center px-0" // 🔥 CENTRAR ICONOS
              )}
            >
              <item.icon size={18} />

              {!collapsed && <span>{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* FOOTER */}
      <div className="p-3 border-t">
        {!collapsed ? (
          <div>
            <p className="text-xs font-medium">
              {currentUser.nombre} {currentUser.apellido}
            </p>
            <p className="text-[10px] text-muted-foreground capitalize">
              {currentUser.rol}
            </p>
          </div>
        ) : (
          <div className="text-center text-xs">👤</div>
        )}
      </div>
    </aside>
  );
}