import { useState } from 'react';
import { PageHeader } from '../components/ui/page-header';
import { StatusBadge } from '../components/ui/status-badge';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { users, areas } from '../data/mockData';
import { Plus, Search } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { toast } from '../hooks/use-toast';

export default function UsersPage() {
  const [search, setSearch] = useState('');
  const [filterArea, setFilterArea] = useState('all');
  const [filterRole, setFilterRole] = useState('all');

  const filtered = users.filter(u => {
    const matchSearch = `${u.nombre} ${u.apellido} ${u.email} ${u.puesto}`.toLowerCase().includes(search.toLowerCase());
    const matchArea = filterArea === 'all' || u.area_id === filterArea;
    const matchRole = filterRole === 'all' || u.rol === filterRole;
    return matchSearch && matchArea && matchRole;
  });

  const getAreaName = (id: string) => areas.find(a => a.id === id)?.nombre || 'N/A';

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="Gestión de Usuarios" description="Administrar usuarios del sistema">
        <Dialog>
          <DialogTrigger asChild>
            <Button><Plus size={16} /> Nuevo Usuario</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Registrar Nuevo Usuario</DialogTitle></DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Nombre</Label><Input placeholder="Nombre" /></div>
                <div className="space-y-2"><Label>Apellido</Label><Input placeholder="Apellido" /></div>
              </div>
              <div className="space-y-2"><Label>Correo electrónico</Label><Input type="email" placeholder="usuario@chedraui.com" /></div>
              <div className="space-y-2"><Label>Contraseña</Label><Input type="password" placeholder="••••••••" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Rol</Label>
                  <Select><SelectTrigger><SelectValue placeholder="Seleccionar" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Administrador</SelectItem>
                      <SelectItem value="supervisor">Supervisor</SelectItem>
                      <SelectItem value="trabajador">Trabajador</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Área</Label>
                  <Select><SelectTrigger><SelectValue placeholder="Seleccionar" /></SelectTrigger>
                    <SelectContent>
                      {areas.map(a => <SelectItem key={a.id} value={a.id}>{a.nombre}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2"><Label>Puesto</Label><Input placeholder="Puesto de trabajo" /></div>
              <Button className="w-full" onClick={() => toast({ title: 'Demo', description: 'Usuario registrado (demo)' })}>Registrar Usuario</Button>
            </div>
          </DialogContent>
        </Dialog>
      </PageHeader>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Buscar por nombre, email o puesto..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <Select value={filterArea} onValueChange={setFilterArea}>
          <SelectTrigger className="w-[180px]"><SelectValue placeholder="Área" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las áreas</SelectItem>
            {areas.map(a => <SelectItem key={a.id} value={a.id}>{a.nombre}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={filterRole} onValueChange={setFilterRole}>
          <SelectTrigger className="w-[160px]"><SelectValue placeholder="Rol" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los roles</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="supervisor">Supervisor</SelectItem>
            <SelectItem value="trabajador">Trabajador</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Nombre</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Email</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Rol</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Área</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Puesto</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Estado</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-xs font-semibold text-primary">{u.nombre[0]}{u.apellido[0]}</span>
                      </div>
                      <span className="font-medium text-foreground">{u.nombre} {u.apellido}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{u.email}</td>
                  <td className="px-4 py-3 capitalize text-foreground">{u.rol}</td>
                  <td className="px-4 py-3 text-muted-foreground">{getAreaName(u.area_id)}</td>
                  <td className="px-4 py-3 text-muted-foreground">{u.puesto}</td>
                  <td className="px-4 py-3"><StatusBadge status={u.activo ? 'activo' : 'inactivo'} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
