import { PageHeader } from '../components/ui/page-header';
import { evaluations, users } from '../data/mockData';
import { Button } from '../components/ui/button';
import { Plus, Star } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { toast } from '../hooks/use-toast';
import { useAuth } from '../context/AuthContext';

export default function EvaluationsPage() {
  const { currentUser } = useAuth();
  if (!currentUser) return null;

  const getUserName = (id: string) => { const u = users.find(u => u.id === id); return u ? `${u.nombre} ${u.apellido}` : 'N/A'; };
  const canCreate = currentUser.rol === 'supervisor' || currentUser.rol === 'admin';

  const getScoreColor = (score: number) => {
    if (score >= 9) return 'text-success';
    if (score >= 7) return 'text-info';
    return 'text-warning';
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="Evaluaciones de Desempeño" description="Registro y consulta de evaluaciones">
        {canCreate && (
          <Dialog>
            <DialogTrigger asChild><Button><Plus size={16} /> Nueva Evaluación</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Registrar Evaluación</DialogTitle></DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label>Trabajador</Label>
                  <Select><SelectTrigger><SelectValue placeholder="Seleccionar" /></SelectTrigger>
                    <SelectContent>
                      {users.filter(u => u.rol === 'trabajador' && u.activo).map(u => (
                        <SelectItem key={u.id} value={u.id}>{u.nombre} {u.apellido}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2"><Label>Periodo</Label><Input placeholder="2026-Q1" /></div>
                  <div className="space-y-2"><Label>Calificación (0-10)</Label><Input type="number" min="0" max="10" step="0.1" /></div>
                </div>
                <div className="space-y-2"><Label>Comentarios</Label><Textarea placeholder="Observaciones sobre el desempeño" /></div>
                <Button className="w-full" onClick={() => toast({ title: 'Demo', description: 'Evaluación registrada (demo)' })}>Registrar Evaluación</Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </PageHeader>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {evaluations.map(ev => (
          <div key={ev.id} className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-foreground">{getUserName(ev.trabajador_id)}</h3>
                <p className="text-xs text-muted-foreground">Evaluador: {getUserName(ev.supervisor_id)}</p>
              </div>
              <div className="flex items-center gap-1">
                <Star size={18} className={getScoreColor(ev.calificacion)} fill="currentColor" />
                <span className={`text-xl font-bold ${getScoreColor(ev.calificacion)}`}>{ev.calificacion}</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">{ev.comentarios}</p>
            <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
              <span>Periodo: {ev.periodo}</span>
              <span>Fecha: {ev.fecha}</span>
            </div>
            <div className="mt-3 bg-muted rounded-full h-2">
              <div className="h-2 rounded-full bg-primary transition-all" style={{ width: `${ev.calificacion * 10}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
