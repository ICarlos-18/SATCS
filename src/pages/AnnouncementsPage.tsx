import { useAuth } from '../context/AuthContext';
import { PageHeader } from '../components/ui/page-header';
import { Button } from '../components/ui/button';
import { announcements, users } from '../data/mockData';
import { Plus, Megaphone } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { toast } from '../hooks/use-toast';

export default function AnnouncementsPage() {
  const { currentUser } = useAuth();
  if (!currentUser) return null;

  const canCreate = currentUser.rol === 'admin' || currentUser.rol === 'supervisor';
  const getUserName = (id: string) => { const u = users.find(u => u.id === id); return u ? `${u.nombre} ${u.apellido}` : 'N/A'; };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="Avisos Generales" description="Comunicados para todo el personal">
        {canCreate && (
          <Dialog>
            <DialogTrigger asChild><Button><Plus size={16} /> Nuevo Aviso</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Publicar Aviso</DialogTitle></DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2"><Label>Título</Label><Input placeholder="Título del aviso" /></div>
                <div className="space-y-2"><Label>Contenido</Label><Textarea placeholder="Contenido del aviso" rows={5} /></div>
                <Button className="w-full" onClick={() => toast({ title: 'Demo', description: 'Aviso publicado (demo)' })}>Publicar Aviso</Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </PageHeader>

      <div className="space-y-4">
        {announcements.map(a => (
          <div key={a.id} className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-start gap-4">
              <div className="p-2.5 rounded-lg bg-primary/10 flex-shrink-0">
                <Megaphone size={20} className="text-primary" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-foreground text-lg">{a.titulo}</h3>
                  <span className="text-xs text-muted-foreground">{a.fecha}</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{a.contenido}</p>
                <p className="text-xs text-muted-foreground mt-3">Publicado por: {getUserName(a.autor_id)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
