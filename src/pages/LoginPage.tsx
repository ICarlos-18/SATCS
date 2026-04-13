import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { toast } from '../hooks/use-toast';

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(email, password)) {
      toast({ title: 'Bienvenido', description: 'Sesión iniciada correctamente' });
    } else {
      toast({ title: 'Error', description: 'Credenciales inválidas o usuario inactivo', variant: 'destructive' });
    }
  };

  const quickLogin = (email: string) => {
    setEmail(email);
    login(email, '123');
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 gradient-primary items-center justify-center p-12">
        <div className="max-w-md text-center">
          <div className="w-20 h-20 rounded-2xl bg-primary-foreground/20 flex items-center justify-center mx-auto mb-8">
            <span className="text-4xl font-bold text-primary-foreground">C</span>
          </div>
          <h2 className="text-3xl font-bold text-primary-foreground mb-4">
            Sistema de Gestión de Personal
          </h2>
          <p className="text-primary-foreground/80 text-lg">
            Chedraui Sucursal 601
          </p>
          <p className="text-primary-foreground/60 text-sm mt-2">
            Administración y seguimiento de tareas del personal
          </p>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-sm">
          <div className="lg:hidden mb-8 text-center">
            <div className="w-14 h-14 rounded-xl gradient-primary flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-primary-foreground">C</span>
            </div>
            <h2 className="text-xl font-bold text-foreground">Chedraui S601</h2>
          </div>

          <h1 className="text-2xl font-bold text-foreground mb-1">Iniciar Sesión</h1>
          <p className="text-sm text-muted-foreground mb-6">Ingresa tus credenciales para acceder al sistema</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input id="email" type="email" placeholder="usuario@chedraui.com" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input id="password" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
            </div>
            <Button type="submit" className="w-full">Iniciar Sesión</Button>
          </form>

          <div className="mt-8">
            <p className="text-xs text-muted-foreground mb-3 text-center">Acceso rápido (demo)</p>
            <div className="space-y-2">
              <button onClick={() => quickLogin('carlos.ramirez@chedraui.com')} className="w-full text-left px-3 py-2 rounded-lg border border-border text-sm hover:bg-muted transition-colors">
                <span className="font-medium text-foreground">Admin</span>
                <span className="text-muted-foreground ml-2">— Carlos Ramírez</span>
              </button>
              <button onClick={() => quickLogin('maria.gonzalez@chedraui.com')} className="w-full text-left px-3 py-2 rounded-lg border border-border text-sm hover:bg-muted transition-colors">
                <span className="font-medium text-foreground">Supervisor</span>
                <span className="text-muted-foreground ml-2">— María González</span>
              </button>
              <button onClick={() => quickLogin('ana.martinez@chedraui.com')} className="w-full text-left px-3 py-2 rounded-lg border border-border text-sm hover:bg-muted transition-colors">
                <span className="font-medium text-foreground">Trabajador</span>
                <span className="text-muted-foreground ml-2">— Ana Martínez</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
