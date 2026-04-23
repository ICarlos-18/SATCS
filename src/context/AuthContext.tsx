import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from '../types';

// 🔥 Firebase
import { 
  onAuthStateChanged, 
  signOut, 
  signInWithEmailAndPassword,
  sendPasswordResetEmail
} from 'firebase/auth';
import { auth } from '../firebase/config';

// 🔥 Firestore
import { getUserByEmail, updateUser } from '../services/firestore';

// 🔥 Toast
import { toast } from '../hooks/use-toast';

interface AuthContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // 🔐 LOGIN
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);

      const userData = await getUserByEmail(userCredential.user.email!);

      if (userData && userData.activo) {
        setCurrentUser(userData);
        return true;
      }

      return false;

    } catch (error: any) {
      console.error("Error en login:", error);

      const user = await getUserByEmail(email);

      // 🔥 Usuario existe pero no ha activado
      if (user && user.needsPassword) {
        try {
          await sendPasswordResetEmail(auth, email);

          toast({
            title: 'Activa tu cuenta 📩',
            description: 'Te enviamos un correo para crear tu contraseña',
            variant: 'destructive'
          });

        } catch (e) {
          toast({
            title: 'Error',
            description: 'No se pudo enviar el correo',
            variant: 'destructive'
          });
        }

        return false;
      }

      toast({
        title: 'Error',
        description: 'Credenciales inválidas',
        variant: 'destructive'
      });

      return false;
    }
  };

  // 🔥 DETECCIÓN AUTOMÁTICA (CLAVE REAL)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {

      if (firebaseUser?.email) {
        const userData = await getUserByEmail(firebaseUser.email);

        if (userData) {

          // 🔥 AQUÍ ESTÁ EL FIX REAL
          if (userData.needsPassword) {
            await updateUser(userData.id, {
              needsPassword: false,
              fecha_activacion: new Date().toISOString()
            });

            userData.needsPassword = false;

            toast({
              title: 'Cuenta activada 🎉',
              description: 'Tu cuenta ha sido activada correctamente'
            });
          }

          setCurrentUser(userData);
        } else {
          setCurrentUser(null);
        }

      } else {
        setCurrentUser(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // 🔓 Logout
  const logout = async () => {
    await signOut(auth);
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        login,
        logout,
        isAuthenticated: !!currentUser,
        loading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};