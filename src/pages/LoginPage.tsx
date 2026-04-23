import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { toast } from '../hooks/use-toast';
import { useNavigate } from 'react-router-dom';

// 🔥 Firebase
import { 
  sendPasswordResetEmail, 
  createUserWithEmailAndPassword 
} from 'firebase/auth';
import { auth } from '../firebase/config';

// 🔥 Firestore
import { getUserByEmail } from '../services/firestore';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [needsActivation, setNeedsActivation] = useState(false);

  // 🔍 Detectar si necesita activación (solo visual)
  useEffect(() => {
    const checkUser = async () => {
      if (!email.includes('@')) return;

      try {
        const user = await getUserByEmail(email);

        if (user && user.needsPassword) {
          setNeedsActivation(true);
        } else {
          setNeedsActivation(false);
        }
      } catch {
        setNeedsActivation(false);
      }
    };

    const delay = setTimeout(checkUser, 500);
    return () => clearTimeout(delay);
  }, [email]);

  // 🔐 LOGIN (🔥 YA NO BLOQUEA)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast({
        title: 'Campos incompletos',
        description: 'Por favor llena todos los campos',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);

    const success = await login(email, password);

    if (success) {
      toast({
        title: 'Bienvenido 👋',
        description: 'Sesión iniciada correctamente'
      });

      navigate('/dashboard');
    } else {
      toast({
        title: 'Error',
        description: 'Credenciales inválidas o usuario inactivo',
        variant: 'destructive'
      });
    }

    setLoading(false);
  };

  // 🔥 ACTIVAR CUENTA (PRO)
  const handleActivateAccount = async () => {
    if (!email) {
      toast({
        title: 'Correo requerido',
        description: 'Ingresa tu correo primero',
        variant: 'destructive'
      });
      return;
    }

    try {
      // Crear usuario si no existe
      await createUserWithEmailAndPassword(auth, email, "Temp123456!");

      // Enviar correo
      await sendPasswordResetEmail(auth, email);

      toast({
        title: 'Correo enviado 📩',
        description: 'Revisa tu correo para crear tu contraseña'
      });

    } catch (error: any) {

      // Si ya existe → solo enviar correo
      if (error.code === "auth/email-already-in-use") {
        await sendPasswordResetEmail(auth, email);

        toast({
          title: 'Correo enviado',
          description: 'Revisa tu correo para crear o recuperar tu contraseña'
        });

      } else {
        console.error(error);

        toast({
          title: 'Error',
          description: 'No se pudo enviar el correo',
          variant: 'destructive'
        });
      }
    }
  };

  // 🔄 RECUPERAR CONTRASEÑA
  const handleForgotPassword = async () => {
    if (!email) {
      toast({
        title: 'Correo requerido',
        description: 'Ingresa tu correo primero',
        variant: 'destructive'
      });
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);

      toast({
        title: 'Correo enviado',
        description: 'Revisa tu correo para restablecer tu contraseña'
      });

    } catch {
      toast({
        title: 'Error',
        description: 'No se pudo enviar el correo',
        variant: 'destructive'
      });
    }
  };

  // ⚡ LOGIN DEMO
  const quickLogin = async (email: string) => {
    setLoading(true);

    const success = await login(email, '123');

    if (success) navigate('/dashboard');

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex">

      {/* IZQUIERDA */}
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
        </div>
      </div>

      {/* DERECHA */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-sm">

          <h1 className="text-2xl font-bold mb-1">
            Iniciar Sesión
          </h1>

          <p className="text-sm text-muted-foreground mb-6">
            Ingresa tus credenciales
          </p>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-4">

            <div className="space-y-2">
              <Label>Correo</Label>
              <Input
                type="email"
                placeholder="usuario@chedraui.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Contraseña</Label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Entrando...' : 'Iniciar Sesión'}
            </Button>

          </form>

          {/* 🔥 INTELIGENTE */}
          <div className="mt-4 text-center space-y-2">

            {needsActivation && (
              <button
                onClick={handleActivateAccount}
                className="text-sm text-yellow-500 hover:underline"
              >
                🔥 Activar cuenta (primera vez)
              </button>
            )}

            {!needsActivation && (
              <button
                onClick={handleForgotPassword}
                className="text-sm text-primary hover:underline"
              >
                ¿Olvidaste tu contraseña?
              </button>
            )}

          </div>

          {/* DEMO */}
          <div className="mt-8">
            <p className="text-xs text-muted-foreground mb-3 text-center">
              Acceso rápido (demo)
            </p>

            <div className="space-y-2">

              <button
                onClick={() => quickLogin('carlos.ramirez@chedraui.com')}
                className="w-full text-left px-3 py-2 rounded-lg border text-sm hover:bg-muted"
              >
                <b>Admin</b> — Carlos
              </button>

              <button
                onClick={() => quickLogin('maria.gonzalez@chedraui.com')}
                className="w-full text-left px-3 py-2 rounded-lg border text-sm hover:bg-muted"
              >
                <b>Supervisor</b> — María
              </button>

              <button
                onClick={() => quickLogin('ana.martinez@chedraui.com')}
                className="w-full text-left px-3 py-2 rounded-lg border text-sm hover:bg-muted"
              >
                <b>Trabajador</b> — Ana
              </button>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}