import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { PageHeader } from '../components/ui/page-header';
import { StatusBadge } from '../components/ui/status-badge';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Plus } from 'lucide-react';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '../components/ui/select';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger
} from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { toast } from '../hooks/use-toast';

// 🔥 Firebase realtime
import {
  addTask,
  updateTask,
  deleteTask,
  listenTasks,
  listenUsers
} from '../services/firestore';

export default function TasksPage() {
  const { currentUser } = useAuth();

  const [tasks, setTasks] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);

  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // 🆕 FORM
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [asignado, setAsignado] = useState('');
  const [prioridad, setPrioridad] = useState('media');

  // 🔴 TIEMPO REAL
  useEffect(() => {
    const unsubscribeTasks = listenTasks(setTasks);
    const unsubscribeUsers = listenUsers(setUsers);

    return () => {
      unsubscribeTasks();
      unsubscribeUsers();
    };
  }, []);

  if (!currentUser) return null;

  // 👤 Filtrar por rol
  const myTasks =
    currentUser.rol === 'trabajador'
      ? tasks.filter((t) => t.asignado_a === currentUser.id)
      : tasks;

  // 🔎 Filtro
  const filtered = myTasks.filter((t) => {
    const matchSearch =
      t.titulo?.toLowerCase().includes(search.toLowerCase()) ||
      t.descripcion?.toLowerCase().includes(search.toLowerCase());

    const matchStatus =
      filterStatus === 'all' || t.estado === filterStatus;

    return matchSearch && matchStatus;
  });

  const getUserName = (id: string) => {
    const u = users.find((u) => u.id === id);
    return u ? u.nombre : 'N/A';
  };

  const canCreate =
    currentUser.rol === 'admin' || currentUser.rol === 'supervisor';

  // ✅ CREAR
  const handleCreate = async () => {
    if (!titulo) {
      toast({ title: 'Error', description: 'El título es obligatorio' });
      return;
    }

    await addTask({
      titulo,
      descripcion,
      estado: 'pendiente',
      prioridad,
      asignado_a: asignado || currentUser.id,
      fecha_inicio: new Date().toISOString().split('T')[0],
      fecha_fin: new Date().toISOString().split('T')[0],
    });

    toast({ title: 'Éxito', description: 'Tarea creada' });

    setTitulo('');
    setDescripcion('');
    setAsignado('');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title={currentUser.rol === 'trabajador' ? 'Mis Tareas' : 'Gestión de Tareas'}
        description="Asignación y seguimiento de tareas"
      >
        {canCreate && (
          <Dialog>
            <DialogTrigger asChild>
              <Button><Plus size={16} /> Nueva Tarea</Button>
            </DialogTrigger>

            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Crear Nueva Tarea</DialogTitle>
              </DialogHeader>

              <div className="space-y-4 pt-4">

                <div>
                  <Label>Título</Label>
                  <Input value={titulo} onChange={(e) => setTitulo(e.target.value)} />
                </div>

                <div>
                  <Label>Descripción</Label>
                  <Textarea value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />
                </div>

                <div>
                  <Label>Asignar a</Label>
                  <Select onValueChange={setAsignado}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar usuario" />
                    </SelectTrigger>
                    <SelectContent>
                      {users.map((u) => (
                        <SelectItem key={u.id} value={u.id}>
                          {u.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button className="w-full" onClick={handleCreate}>
                  Crear Tarea
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </PageHeader>

      {/* 🔎 BUSCADOR */}
      <div className="flex gap-3">
        <Input
          placeholder="Buscar tareas..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-[160px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="pendiente">Pendiente</SelectItem>
            <SelectItem value="en_proceso">En Proceso</SelectItem>
            <SelectItem value="finalizada">Finalizada</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* 📋 LISTA */}
      <div className="space-y-3">
        {filtered.map((task) => (
          <div key={task.id} className="border rounded-xl p-4">

            <h3 className="font-semibold">{task.titulo}</h3>
            <p className="text-sm">{task.descripcion}</p>
            <p className="text-xs">👤 {getUserName(task.asignado_a)}</p>

            <div className="flex gap-2 mt-2">
              <StatusBadge status={task.estado} />

              {/* 🔄 UPDATE */}
              <Select
                defaultValue={task.estado}
                onValueChange={async (value) => {
                  await updateTask(task.id, { estado: value });
                }}
              >
                <SelectTrigger className="w-[120px] h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pendiente">Pendiente</SelectItem>
                  <SelectItem value="en_proceso">En Proceso</SelectItem>
                  <SelectItem value="finalizada">Finalizada</SelectItem>
                </SelectContent>
              </Select>

              {/* 🗑 DELETE */}
              <Button
                variant="destructive"
                onClick={async () => {
                  await deleteTask(task.id);
                  toast({ title: 'Eliminado', description: 'Tarea eliminada' });
                }}
              >
                Eliminar
              </Button>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}
