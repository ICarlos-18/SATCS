import { useAuth } from '../context/AuthContext';
import { PageHeader } from '../components/ui/page-header';
import { Button } from '../components/ui/button';
import { schedules } from '../data/mockData';
import { Plus, Clock, Calendar } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { StatusBadge } from '../components/ui/status-badge';
import { toast } from '../hooks/use-toast';

export default function SchedulesPage() {
  const { currentUser } = useAuth();
  if (!currentUser) return null;

  const canEdit = currentUser.rol === 'admin';

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="Horarios Internos" description="Consulta de horarios establecidos por la empresa">
        {canEdit && (
          <Dialog>
            <DialogTrigger asChild><Button><Plus size={16} /> Nuevo Horario</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Registrar Horario</DialogTitle></DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2"><Label>Nombre</Label><Input placeholder="Nombre del horario" /></div>
                <div className="space-y-2"><Label>Descripción</Label><Textarea placeholder="Descripción" /></div>
                <div className="space-y-2"><Label>Horario</Label><Input placeholder="07:00 - 15:00" /></div>
                <div className="space-y-2"><Label>Días</Label><Input placeholder="Lunes a Viernes" /></div>
                <Button className="w-full" onClick={() => toast({ title: 'Demo', description: 'Horario registrado (demo)' })}>Registrar</Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </PageHeader>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {schedules.map(s => (
          <div key={s.id} className="bg-card border border-border rounded-xl p-5 hover:shadow-sm transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="p-2 rounded-lg bg-info/10">
                <Clock size={20} className="text-info" />
              </div>
              <StatusBadge status={s.activo ? 'activo' : 'inactivo'} />
            </div>
            <h3 className="font-semibold text-foreground text-lg">{s.nombre}</h3>
            <p className="text-sm text-muted-foreground mt-1">{s.descripcion}</p>
            <div className="mt-4 pt-3 border-t border-border space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Clock size={14} className="text-muted-foreground" />
                <span className="text-foreground font-medium">{s.horario}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Calendar size={14} className="text-muted-foreground" />
                <span className="text-muted-foreground">{s.dias}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
