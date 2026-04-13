import { PageHeader } from '../components/ui/page-header';
import { Button } from '../components/ui/button';
import { areas, users } from '../data/mockData';
import { Plus, Users } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { toast } from '../hooks/use-toast';

export default function AreasPage() {
  const getWorkerCount = (areaId: string) => users.filter(u => u.area_id === areaId && u.activo).length;
  const getResponsable = (id: string) => { const u = users.find(u => u.id === id); return u ? `${u.nombre} ${u.apellido}` : 'N/A'; };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="Áreas y Departamentos" description="Gestión de áreas de la sucursal">
        <Dialog>
          <DialogTrigger asChild><Button><Plus size={16} /> Nueva Área</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Registrar Nueva Área</DialogTitle></DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2"><Label>Nombre</Label><Input placeholder="Nombre del área" /></div>
              <div className="space-y-2"><Label>Descripción</Label><Textarea placeholder="Descripción del área" /></div>
              <Button className="w-full" onClick={() => toast({ title: 'Demo', description: 'Área registrada (demo)' })}>Registrar Área</Button>
            </div>
          </DialogContent>
        </Dialog>
      </PageHeader>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {areas.map(area => (
          <div key={area.id} className="bg-card border border-border rounded-xl p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Users size={20} className="text-primary" />
              </div>
              <span className="text-xs bg-muted px-2 py-1 rounded-full text-muted-foreground">
                {getWorkerCount(area.id)} trabajadores
              </span>
            </div>
            <h3 className="font-semibold text-foreground text-lg">{area.nombre}</h3>
            <p className="text-sm text-muted-foreground mt-1">{area.descripcion}</p>
            <div className="mt-4 pt-3 border-t border-border">
              <p className="text-xs text-muted-foreground">Responsable: <span className="text-foreground font-medium">{getResponsable(area.responsable_id)}</span></p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
