import { useState } from 'react';
import { PageHeader } from '../components/ui/page-header';
import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/textarea';
import { suggestions, areas } from '../data/mockData';
import { Send, ShieldCheck } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { toast } from '../hooks/use-toast';

export default function SuggestionsPage() {
  const [mensaje, setMensaje] = useState('');
  const [areaId, setAreaId] = useState('');

  const getAreaName = (id: string) => areas.find(a => a.id === id)?.nombre || 'General';

  const handleSubmit = () => {
    if (!mensaje.trim()) return;
    toast({ title: 'Sugerencia enviada', description: 'Tu sugerencia ha sido enviada de forma anónima' });
    setMensaje('');
    setAreaId('');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="Sugerencias y Observaciones" description="Envía comentarios de forma anónima" />

      {/* Submit form */}
      <div className="bg-card border border-border rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <ShieldCheck size={18} className="text-success" />
          <p className="text-sm text-success font-medium">Tu identidad será protegida — sugerencia anónima</p>
        </div>
        <div className="space-y-4">
          <Select value={areaId} onValueChange={setAreaId}>
            <SelectTrigger><SelectValue placeholder="Selecciona el área relacionada" /></SelectTrigger>
            <SelectContent>{areas.map(a => <SelectItem key={a.id} value={a.id}>{a.nombre}</SelectItem>)}</SelectContent>
          </Select>
          <Textarea placeholder="Escribe tu sugerencia u observación..." value={mensaje} onChange={e => setMensaje(e.target.value)} rows={4} />
          <Button onClick={handleSubmit} disabled={!mensaje.trim()}><Send size={16} /> Enviar Sugerencia</Button>
        </div>
      </div>

      {/* List */}
      <div className="space-y-3">
        <h3 className="font-semibold text-foreground">Sugerencias Recibidas</h3>
        {suggestions.map(s => (
          <div key={s.id} className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs bg-muted px-2 py-1 rounded-full text-muted-foreground">{getAreaName(s.area_id)}</span>
              {s.anonimo && <span className="text-xs bg-success/10 px-2 py-1 rounded-full text-success">Anónimo</span>}
            </div>
            <p className="text-sm text-foreground">{s.mensaje}</p>
            <p className="text-xs text-muted-foreground mt-2">{s.fecha}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
