import { cn } from '../../lib/utils';

type BadgeVariant = 'pendiente' | 'en_proceso' | 'finalizada' | 'alta' | 'media' | 'baja' | 'activo' | 'inactivo';

const styles: Record<BadgeVariant, string> = {
  pendiente: 'bg-warning/10 text-warning border-warning/20',
  en_proceso: 'bg-info/10 text-info border-info/20',
  finalizada: 'bg-success/10 text-success border-success/20',
  alta: 'bg-destructive/10 text-destructive border-destructive/20',
  media: 'bg-warning/10 text-warning border-warning/20',
  baja: 'bg-muted text-muted-foreground border-border',
  activo: 'bg-success/10 text-success border-success/20',
  inactivo: 'bg-muted text-muted-foreground border-border',
};

const labels: Record<BadgeVariant, string> = {
  pendiente: 'Pendiente',
  en_proceso: 'En Proceso',
  finalizada: 'Finalizada',
  alta: 'Alta',
  media: 'Media',
  baja: 'Baja',
  activo: 'Activo',
  inactivo: 'Inactivo',
};

export function StatusBadge({ status }: { status: BadgeVariant }) {
  return (
    <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border", styles[status])}>
      {labels[status]}
    </span>
  );
}
