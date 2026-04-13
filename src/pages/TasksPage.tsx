import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { PageHeader } from '../components/ui/page-header';
import { StatusBadge } from '../components/ui/status-badge';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { tasks, users, areas } from '../data/mockData';
import { Plus, Search, Calendar } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { toast } from '../hooks/use-toast';

export default function TasksPage() {
  const { currentUser } = useAuth();
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterArea, setFilterArea] = useState('all');

  if (!currentUser) return null;

  const myTasks = currentUser.rol === 'trabajador'
    ? tasks.filter(t => t.asignado_a === currentUser.id)
    : tasks;

  const filtered = myTasks.filter(t => {
    const matchSearch = t.titulo.toLowerCase().includes(search.toLowerCase()) || t.descripcion.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'all' || t.estado === filterStatus;
    const matchArea = filterArea === 'all' || t.area_id === filterArea;
    return matchSearch && matchStatus && matchArea;
  });

  const getUserName = (id: string) => { const u = users.find(u => u.id === id); return u ? `${u.nombre} ${u.apellido}` : 'N/A'; };
  const getAreaName = (id: string) => areas.find(a => a.id === id)?.nombre || 'N/A';

  const canCreate = currentUser.rol === 'admin' || currentUser.rol === 'supervisor';

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title={currentUser.rol === 'trabajador' ? 'Mis Tareas' : 'Gestión de Tareas'} description="Asignación y seguimiento de tareas">
        {canCreate && (
          <Dialog>
            <DialogTrigger asChild><Button><Plus size={16} /> Nueva Tarea</Button></DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader><DialogTitle>Crear Nueva Tarea</DialogTitle></DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2"><Label>Título</Label><Input placeholder="Título de la tarea" /></div>
                <div className="space-y-2"><Label>Descripción</Label><Textarea placeholder="Descripción detallada" /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Asignar a</Label>
                    <Select><SelectTrigger><SelectValue placeholder="Trabajador" /></SelectTrigger>
                      <SelectContent>
                        {users.filter(u => u.rol === 'trabajador' && u.activo).map(u => (
                          <SelectItem key={u.id} value={u.id}>{u.nombre} {u.apellido}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Área</Label>
                    <Select><SelectTrigger><SelectValue placeholder="Área" /></SelectTrigger>
                      <SelectContent>{areas.map(a => <SelectItem key={a.id} value={a.id}>{a.nombre}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2"><Label>Fecha inicio</Label><Input type="date" /></div>
                  <div className="space-y-2"><Label>Fecha fin</Label><Input type="date" /></div>
                </div>
                <div className="space-y-2">
                  <Label>Prioridad</Label>
                  <Select><SelectTrigger><SelectValue placeholder="Prioridad" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="alta">Alta</SelectItem>
                      <SelectItem value="media">Media</SelectItem>
                      <SelectItem value="baja">Baja</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button className="w-full" onClick={() => toast({ title: 'Demo', description: 'Tarea creada (demo)' })}>Crear Tarea</Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </PageHeader>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Buscar tareas..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="pendiente">Pendiente</SelectItem>
            <SelectItem value="en_proceso">En Proceso</SelectItem>
            <SelectItem value="finalizada">Finalizada</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterArea} onValueChange={setFilterArea}>
          <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las áreas</SelectItem>
            {areas.map(a => <SelectItem key={a.id} value={a.id}>{a.nombre}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        {filtered.map(task => (
          <div key={task.id} className="bg-card border border-border rounded-xl p-5 hover:shadow-sm transition-shadow">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-foreground">{task.titulo}</h3>
                  <StatusBadge status={task.prioridad} />
                </div>
                <p className="text-sm text-muted-foreground">{task.descripcion}</p>
                <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-muted-foreground">
                  <span>Asignado: <span className="text-foreground font-medium">{getUserName(task.asignado_a)}</span></span>
                  <span>Área: <span className="text-foreground font-medium">{getAreaName(task.area_id)}</span></span>
                  <span className="flex items-center gap-1"><Calendar size={12} />{task.fecha_inicio} → {task.fecha_fin}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge status={task.estado} />
                {currentUser.rol === 'trabajador' && task.estado !== 'finalizada' && (
                  <Select defaultValue={task.estado}>
                    <SelectTrigger className="w-[130px] h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pendiente">Pendiente</SelectItem>
                      <SelectItem value="en_proceso">En Proceso</SelectItem>
                      <SelectItem value="finalizada">Finalizada</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
