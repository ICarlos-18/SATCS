import { useState, useEffect } from 'react';
import { PageHeader } from '../components/ui/page-header';
import { StatusBadge } from '../components/ui/status-badge';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Plus, Search } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../components/ui/select';
import { toast } from '../hooks/use-toast';

// 🔥 Firebase
import {
  getUsers,
  addUser,
  updateUser,
  deleteUser
} from '../services/firestore';

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);

  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState('all');

  // 🟢 FORM STATES
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [email, setEmail] = useState('');
  const [puesto, setPuesto] = useState('');
  const [rol, setRol] = useState('trabajador');

  // 📥 Cargar usuarios
  useEffect(() => {
    const fetchUsers = async () => {
      const data = await getUsers();
      setUsers(data);
    };
    fetchUsers();
  }, []);

  // 🔎 Filtro
  const filtered = users.filter((u) => {
    const matchSearch = `${u.nombre} ${u.apellido} ${u.email} ${u.puesto}`
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchRole = filterRole === 'all' || u.rol === filterRole;

    return matchSearch && matchRole;
  });

  // ➕ Crear usuario (🔥 PRO FLOW)
  const handleCreateUser = async () => {
    if (!nombre || !email) {
      toast({
        title: 'Error',
        description: 'Nombre y correo son obligatorios',
        variant: 'destructive'
      });
      return;
    }

    try {
      await addUser({
        nombre,
        apellido,
        email,
        puesto,
        rol,
        activo: true,

        // 🔥 CLAVE DEL SISTEMA
        needsPassword: true,
        fecha_alta: new Date().toISOString()
      });

      const updated = await getUsers();
      setUsers(updated);

      toast({
        title: 'Usuario creado',
        description: 'El usuario debe activar su cuenta desde su correo'
      });

      // limpiar form
      setNombre('');
      setApellido('');
      setEmail('');
      setPuesto('');
      setRol('trabajador');

    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo crear el usuario',
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">

      <PageHeader
        title="Gestión de Usuarios"
        description="Administrar usuarios del sistema"
      >
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus size={16} /> Nuevo Usuario
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Registrar Nuevo Usuario</DialogTitle>
            </DialogHeader>

            <div className="space-y-4 pt-4">

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Nombre</Label>
                  <Input value={nombre} onChange={(e) => setNombre(e.target.value)} />
                </div>

                <div>
                  <Label>Apellido</Label>
                  <Input value={apellido} onChange={(e) => setApellido(e.target.value)} />
                </div>
              </div>

              <div>
                <Label>Email</Label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <Label>Rol</Label>
                <Select value={rol} onValueChange={setRol}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar rol" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Administrador</SelectItem>
                    <SelectItem value="supervisor">Supervisor</SelectItem>
                    <SelectItem value="trabajador">Trabajador</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Puesto</Label>
                <Input value={puesto} onChange={(e) => setPuesto(e.target.value)} />
              </div>

              <Button className="w-full" onClick={handleCreateUser}>
                Registrar Usuario
              </Button>

            </div>
          </DialogContent>
        </Dialog>
      </PageHeader>

      {/* 🔎 BUSCADOR */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" />
          <Input
            placeholder="Buscar..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <Select value={filterRole} onValueChange={setFilterRole}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Filtrar rol" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="supervisor">Supervisor</SelectItem>
            <SelectItem value="trabajador">Trabajador</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* 📋 TABLA */}
      <div className="bg-card border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="px-4 py-3 text-left">Nombre</th>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-left">Rol</th>
              <th className="px-4 py-3 text-left">Puesto</th>
              <th className="px-4 py-3 text-left">Estado</th>
              <th className="px-4 py-3 text-left">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((u) => (
              <tr key={u.id} className="border-b hover:bg-muted/30">
                <td className="px-4 py-3">
                  {u.nombre} {u.apellido}
                </td>

                <td className="px-4 py-3">{u.email}</td>

                <td className="px-4 py-3">{u.rol}</td>

                <td className="px-4 py-3">{u.puesto}</td>

                {/* 🔥 ESTADO PRO */}
                <td className="px-4 py-3">
                  {u.needsPassword ? (
                    <span className="text-yellow-500 text-xs font-medium">
                      Pendiente de activación
                    </span>
                  ) : (
                    <StatusBadge status={u.activo ? 'activo' : 'inactivo'} />
                  )}
                </td>

                <td className="px-4 py-3 flex gap-2">

                  <Button
                    size="sm"
                    onClick={async () => {
                      await updateUser(u.id, { activo: !u.activo });

                      const updated = await getUsers();
                      setUsers(updated);
                    }}
                  >
                    {u.activo ? 'Desactivar' : 'Activar'}
                  </Button>

                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={async () => {
                      await deleteUser(u.id);

                      const updated = await getUsers();
                      setUsers(updated);

                      toast({
                        title: 'Eliminado',
                        description: 'Usuario eliminado'
                      });
                    }}
                  >
                    Eliminar
                  </Button>

                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}