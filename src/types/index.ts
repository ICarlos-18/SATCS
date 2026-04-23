export type UserRole = 'admin' | 'supervisor' | 'trabajador';

export interface User {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  rol: UserRole;
  area_id: string;
  puesto: string;
  activo: boolean;
  fecha_alta: string;
  avatar?: string;

  // 🔥 NUEVO (CLAVE DEL SISTEMA)
  needsPassword?: boolean;

  // 🔥 OPCIONAL (MEJOR PRÁCTICA)
  createdAt?: any; // puedes cambiar a Timestamp si luego usas Firestore types
}

export interface Area {
  id: string;
  nombre: string;
  descripcion: string;
  responsable_id: string;
}

export type TaskStatus = 'pendiente' | 'en_proceso' | 'finalizada';
export type TaskPriority = 'alta' | 'media' | 'baja';

export interface Task {
  id: string;
  titulo: string;
  descripcion: string;
  asignado_a: string;
  creado_por: string;
  area_id: string;
  estado: TaskStatus;
  prioridad: TaskPriority;
  fecha_inicio: string;
  fecha_fin: string;
  fecha_creacion: string;
}

export interface Evaluation {
  id: string;
  trabajador_id: string;
  supervisor_id: string;
  periodo: string;
  calificacion: number;
  comentarios: string;
  fecha: string;
}

export interface Suggestion {
  id: string;
  area_id: string;
  mensaje: string;
  fecha: string;
  anonimo: boolean;
}

export interface Announcement {
  id: string;
  titulo: string;
  contenido: string;
  autor_id: string;
  fecha: string;
  activo: boolean;
}

export interface Schedule {
  id: string;
  nombre: string;
  descripcion: string;
  horario: string;
  dias: string;
  activo: boolean;
}