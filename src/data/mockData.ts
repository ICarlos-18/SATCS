import { User, Area, Task, Evaluation, Suggestion, Announcement, Schedule } from '../types';

export const areas: Area[] = [
  { id: 'a1', nombre: 'Abarrotes', descripcion: 'Sección de productos de abarrotes', responsable_id: 'u2' },
  { id: 'a2', nombre: 'Frutas y Verduras', descripcion: 'Sección de productos frescos', responsable_id: 'u2' },
  { id: 'a3', nombre: 'Cajas', descripcion: 'Área de cobro y atención al cliente', responsable_id: 'u3' },
  { id: 'a4', nombre: 'Almacén', descripcion: 'Recepción y almacenamiento de mercancía', responsable_id: 'u3' },
  { id: 'a5', nombre: 'Electrónica', descripcion: 'Productos electrónicos y tecnología', responsable_id: 'u2' },
];

export const users: User[] = [
  { id: 'u1', nombre: 'Carlos', apellido: 'Ramírez', email: 'carlos.ramirez@chedraui.com', rol: 'admin', area_id: 'a1', puesto: 'Gerente de Sucursal', activo: true, fecha_alta: '2023-01-15' },
  { id: 'u2', nombre: 'María', apellido: 'González', email: 'maria.gonzalez@chedraui.com', rol: 'supervisor', area_id: 'a1', puesto: 'Supervisora de Piso', activo: true, fecha_alta: '2023-03-20' },
  { id: 'u3', nombre: 'Roberto', apellido: 'López', email: 'roberto.lopez@chedraui.com', rol: 'supervisor', area_id: 'a3', puesto: 'Supervisor de Cajas', activo: true, fecha_alta: '2023-02-10' },
  { id: 'u4', nombre: 'Ana', apellido: 'Martínez', email: 'ana.martinez@chedraui.com', rol: 'trabajador', area_id: 'a1', puesto: 'Auxiliar de Abarrotes', activo: true, fecha_alta: '2023-06-01' },
  { id: 'u5', nombre: 'José', apellido: 'Hernández', email: 'jose.hernandez@chedraui.com', rol: 'trabajador', area_id: 'a2', puesto: 'Encargado de Frutas', activo: true, fecha_alta: '2023-05-15' },
  { id: 'u6', nombre: 'Laura', apellido: 'Sánchez', email: 'laura.sanchez@chedraui.com', rol: 'trabajador', area_id: 'a3', puesto: 'Cajera', activo: true, fecha_alta: '2023-07-20' },
  { id: 'u7', nombre: 'Pedro', apellido: 'Torres', email: 'pedro.torres@chedraui.com', rol: 'trabajador', area_id: 'a4', puesto: 'Almacenista', activo: true, fecha_alta: '2023-04-10' },
  { id: 'u8', nombre: 'Diana', apellido: 'Flores', email: 'diana.flores@chedraui.com', rol: 'trabajador', area_id: 'a5', puesto: 'Vendedora Electrónica', activo: false, fecha_alta: '2023-08-05' },
];

export const tasks: Task[] = [
  { id: 't1', titulo: 'Reacomodo de estantes', descripcion: 'Reorganizar productos de abarrotes en la sección A3', asignado_a: 'u4', creado_por: 'u2', area_id: 'a1', estado: 'en_proceso', prioridad: 'alta', fecha_inicio: '2026-04-01', fecha_fin: '2026-04-05', fecha_creacion: '2026-03-30' },
  { id: 't2', titulo: 'Inventario de frutas', descripcion: 'Realizar conteo físico de inventario de frutas y verduras', asignado_a: 'u5', creado_por: 'u2', area_id: 'a2', estado: 'pendiente', prioridad: 'alta', fecha_inicio: '2026-04-03', fecha_fin: '2026-04-04', fecha_creacion: '2026-04-01' },
  { id: 't3', titulo: 'Limpieza de cajas', descripcion: 'Limpieza y desinfección de las áreas de cobro', asignado_a: 'u6', creado_por: 'u3', area_id: 'a3', estado: 'finalizada', prioridad: 'media', fecha_inicio: '2026-03-28', fecha_fin: '2026-03-29', fecha_creacion: '2026-03-27' },
  { id: 't4', titulo: 'Recepción de mercancía', descripcion: 'Recibir y verificar pedido de proveedor nacional', asignado_a: 'u7', creado_por: 'u3', area_id: 'a4', estado: 'pendiente', prioridad: 'alta', fecha_inicio: '2026-04-06', fecha_fin: '2026-04-06', fecha_creacion: '2026-04-04' },
  { id: 't5', titulo: 'Actualizar precios', descripcion: 'Cambiar etiquetas de precios en promociones semanales', asignado_a: 'u4', creado_por: 'u2', area_id: 'a1', estado: 'finalizada', prioridad: 'media', fecha_inicio: '2026-03-25', fecha_fin: '2026-03-26', fecha_creacion: '2026-03-24' },
  { id: 't6', titulo: 'Capacitación sistema POS', descripcion: 'Asistir a capacitación del nuevo sistema de cobro', asignado_a: 'u6', creado_por: 'u3', area_id: 'a3', estado: 'en_proceso', prioridad: 'media', fecha_inicio: '2026-04-02', fecha_fin: '2026-04-08', fecha_creacion: '2026-04-01' },
  { id: 't7', titulo: 'Exhibición productos nuevos', descripcion: 'Montar exhibición de productos electrónicos nuevos', asignado_a: 'u8', creado_por: 'u2', area_id: 'a5', estado: 'pendiente', prioridad: 'baja', fecha_inicio: '2026-04-07', fecha_fin: '2026-04-10', fecha_creacion: '2026-04-05' },
];

export const evaluations: Evaluation[] = [
  { id: 'e1', trabajador_id: 'u4', supervisor_id: 'u2', periodo: '2026-Q1', calificacion: 8.5, comentarios: 'Buen desempeño, puntual y responsable. Mejorar en velocidad de acomodo.', fecha: '2026-03-31' },
  { id: 'e2', trabajador_id: 'u5', supervisor_id: 'u2', periodo: '2026-Q1', calificacion: 9.2, comentarios: 'Excelente manejo de productos frescos, proactivo.', fecha: '2026-03-31' },
  { id: 'e3', trabajador_id: 'u6', supervisor_id: 'u3', periodo: '2026-Q1', calificacion: 7.8, comentarios: 'Buena atención al cliente, necesita mejorar velocidad en cobro.', fecha: '2026-03-31' },
  { id: 'e4', trabajador_id: 'u7', supervisor_id: 'u3', periodo: '2026-Q1', calificacion: 8.0, comentarios: 'Cumple con los tiempos de recepción, organizado.', fecha: '2026-03-31' },
];

export const suggestions: Suggestion[] = [
  { id: 's1', area_id: 'a1', mensaje: 'Sería bueno tener más carritos de carga para el acomodo de mercancía pesada.', fecha: '2026-04-01', anonimo: true },
  { id: 's2', area_id: 'a3', mensaje: 'Mejorar la iluminación en el área de cajas, a veces es difícil ver las etiquetas.', fecha: '2026-04-02', anonimo: true },
  { id: 's3', area_id: 'a2', mensaje: 'Propongo implementar un sistema de rotación más eficiente para los productos perecederos.', fecha: '2026-04-03', anonimo: true },
  { id: 's4', area_id: 'a4', mensaje: 'Los horarios de descarga podrían ajustarse para evitar conflictos con el flujo de clientes.', fecha: '2026-04-04', anonimo: false },
];

export const announcements: Announcement[] = [
  { id: 'an1', titulo: 'Junta general de personal', contenido: 'Se convoca a todos los trabajadores a junta general el viernes 10 de abril a las 8:00 AM en el salón de usos múltiples.', autor_id: 'u1', fecha: '2026-04-05', activo: true },
  { id: 'an2', titulo: 'Nuevos uniformes disponibles', contenido: 'A partir del lunes 13 de abril estarán disponibles los nuevos uniformes. Pasar a recursos humanos para la entrega.', autor_id: 'u1', fecha: '2026-04-04', activo: true },
  { id: 'an3', titulo: 'Promoción del Día del Niño', contenido: 'Recuerden la dinámica especial por el Día del Niño. Revisar los descuentos aplicables en el sistema.', autor_id: 'u2', fecha: '2026-04-03', activo: true },
];

export const schedules: Schedule[] = [
  { id: 'sc1', nombre: 'Horario de baños', descripcion: 'Horarios asignados para uso de sanitarios por área', horario: '10:00 - 10:15, 14:00 - 14:15, 18:00 - 18:15', dias: 'Lunes a Domingo', activo: true },
  { id: 'sc2', nombre: 'Horario de comedor', descripcion: 'Turnos de comida para el personal', horario: 'T1: 13:00-14:00, T2: 14:00-15:00, T3: 15:00-16:00', dias: 'Lunes a Domingo', activo: true },
  { id: 'sc3', nombre: 'Horario de descarga', descripcion: 'Recepción de mercancía en almacén', horario: '06:00 - 09:00', dias: 'Lunes a Sábado', activo: true },
  { id: 'sc4', nombre: 'Turno matutino', descripcion: 'Horario del turno matutino general', horario: '07:00 - 15:00', dias: 'Lunes a Domingo (rotativo)', activo: true },
  { id: 'sc5', nombre: 'Turno vespertino', descripcion: 'Horario del turno vespertino general', horario: '15:00 - 22:00', dias: 'Lunes a Domingo (rotativo)', activo: true },
];
