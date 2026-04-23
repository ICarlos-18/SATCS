import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { PageHeader } from '../components/ui/page-header';
import { Button } from '../components/ui/button';
import { Plus, Megaphone } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
  
} from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { toast } from '../hooks/use-toast';

// 🔥 Firebase
import {
  getAnnouncements,
  addAnnouncement,
  deleteAnnouncement,
  getUsers
} from '../services/firestore';

export default function AnnouncementsPage() {
  const { currentUser } = useAuth();
  if (!currentUser) return null;

  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);

  // 🟢 FORM
  const [titulo, setTitulo] = useState('');
  const [contenido, setContenido] = useState('');

  const canCreate =
    currentUser.rol === 'admin' || currentUser.rol === 'supervisor';

  // 📥 Cargar datos
  useEffect(() => {
    const fetchData = async () => {
      const dataA = await getAnnouncements();
      const dataU = await getUsers();

      setAnnouncements(dataA);
      setUsers(dataU);
    };

    fetchData();
  }, []);

  // 🔎 Obtener nombre del autor
  const getUserName = (id: string) => {
    const u = users.find((u) => u.id === id);
    return u ? `${u.nombre} ${u.apellido}` : 'N/A';
  };

  // ➕ Crear aviso
  const handleCreate = async () => {
    if (!titulo || !contenido) {
      toast({ title: 'Error', description: 'Faltan datos' });
      return;
    }

    await addAnnouncement({
      titulo,
      contenido,
      fecha: new Date().toISOString().split('T')[0],
      autor_id: currentUser.id,
      activo: true
    });

    const updated = await getAnnouncements();
    setAnnouncements(updated);

    toast({ title: 'Éxito', description: 'Aviso publicado' });

    setTitulo('');
    setContenido('');
  };

  // 🗑 Eliminar
  const handleDelete = async (id: string) => {
    await deleteAnnouncement(id);

    const updated = await getAnnouncements();
    setAnnouncements(updated);

    toast({ title: 'Eliminado', description: 'Aviso eliminado' });
  };

  return (
    <div className="space-y-6 animate-fade-in">

      <PageHeader
        title="Avisos Generales"
        description="Comunicados para todo el personal"
      >
        {canCreate && (
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus size={16} /> Nuevo Aviso
              </Button>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>Publicar Aviso</DialogTitle>
              </DialogHeader>

              <div className="space-y-4 pt-4">

                <div>
                  <Label>Título</Label>
                  <Input
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                  />
                </div>

                <div>
                  <Label>Contenido</Label>
                  <Textarea
                    rows={5}
                    value={contenido}
                    onChange={(e) => setContenido(e.target.value)}
                  />
                </div>

                <Button className="w-full" onClick={handleCreate}>
                  Publicar Aviso
                </Button>

              </div>
            </DialogContent>
          </Dialog>
        )}
      </PageHeader>

      {/* 📢 LISTA */}
      <div className="space-y-4">
        {announcements.map((a) => (
          <div
            key={a.id}
            className="bg-card border border-border rounded-xl p-6"
          >
            <div className="flex items-start gap-4">
              <div className="p-2.5 rounded-lg bg-primary/10">
                <Megaphone size={20} className="text-primary" />
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-lg">{a.titulo}</h3>
                  <span className="text-xs text-muted-foreground">
                    {a.fecha}
                  </span>
                </div>

                <p className="text-sm text-muted-foreground">
                  {a.contenido}
                </p>

                <p className="text-xs text-muted-foreground mt-3">
                  Publicado por: {getUserName(a.autor_id)}
                </p>

                {canCreate && (
                  <Button
                    size="sm"
                    variant="destructive"
                    className="mt-3"
                    onClick={() => handleDelete(a.id)}
                  >
                    Eliminar
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}