import { Provider, CategoryType } from '@/data/mockData';

const providerConfig: Record<Provider, { bg: string; text: string; label: string }> = {
  aws: { bg: 'bg-aws/10', text: 'text-aws', label: 'AWS' },
  azure: { bg: 'bg-azure/10', text: 'text-azure', label: 'Azure' },
  oci: { bg: 'bg-oci/10', text: 'text-oci', label: 'OCI' },
};

export function ProviderBadge({ provider, size = 'sm' }: { provider: Provider; size?: 'sm' | 'lg' }) {
  const config = providerConfig[provider];
  return (
    <span className={`inline-flex items-center rounded-full font-semibold ${config.bg} ${config.text} ${
      size === 'lg' ? 'px-3 py-1 text-sm' : 'px-2 py-0.5 text-xs'
    }`}>
      {config.label}
    </span>
  );
}

const statusConfig: Record<string, { bg: string; text: string; dot?: string }> = {
  'Em Preenchimento': { bg: 'bg-muted', text: 'text-muted-foreground' },
  'Aguardando Aprovação': { bg: 'bg-warning/10', text: 'text-warning', dot: 'bg-warning' },
  'Aprovado': { bg: 'bg-info/10', text: 'text-info' },
  'Em Execução': { bg: 'bg-info/10', text: 'text-info', dot: 'bg-info' },
  'Concluído': { bg: 'bg-success/10', text: 'text-success' },
  'Rejeitado': { bg: 'bg-destructive/10', text: 'text-destructive' },
  'Cancelado': { bg: 'bg-muted', text: 'text-muted-foreground' },
};

export function StatusBadge({ status }: { status: string }) {
  const config = statusConfig[status] || statusConfig['Em Preenchimento'];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${config.bg} ${config.text}`}>
      {config.dot && <span className={`w-1.5 h-1.5 rounded-full ${config.dot} animate-pulse-dot`} />}
      {status}
    </span>
  );
}

const criticalityConfig: Record<string, { bg: string; text: string }> = {
  'Baixa': { bg: 'bg-success/10', text: 'text-success' },
  'Média': { bg: 'bg-warning/10', text: 'text-warning' },
  'Alta': { bg: 'bg-aws/10', text: 'text-aws' },
  'Crítica': { bg: 'bg-destructive/10', text: 'text-destructive' },
};

export function CriticalityBadge({ criticality }: { criticality: string }) {
  const config = criticalityConfig[criticality] || criticalityConfig['Média'];
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${config.bg} ${config.text}`}>
      {criticality}
    </span>
  );
}

export function EnvironmentBadge({ env }: { env: string }) {
  const config: Record<string, { bg: string; text: string }> = {
    'Produção': { bg: 'bg-destructive/10', text: 'text-destructive' },
    'Homologação': { bg: 'bg-warning/10', text: 'text-warning' },
    'Desenvolvimento': { bg: 'bg-success/10', text: 'text-success' },
  };
  const c = config[env] || config['Desenvolvimento'];
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${c.bg} ${c.text}`}>
      {env}
    </span>
  );
}

// ============ NEW BADGES ============

const typeConfig: Record<CategoryType, { bg: string; text: string; label: string; border?: string }> = {
  'standard': { bg: 'bg-muted', text: 'text-muted-foreground', label: 'Padrão' },
  'audit': { bg: 'bg-info/10', text: 'text-info', label: 'Auditoria', border: 'ring-1 ring-info/20' },
  'breaking-glass': { bg: 'bg-destructive/10', text: 'text-destructive', label: 'Breaking Glass', border: 'ring-1 ring-destructive/20' },
};

export function TypeBadge({ type }: { type: CategoryType }) {
  const config = typeConfig[type];
  if (type === 'standard') return null;
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold ${config.bg} ${config.text} ${config.border || ''}`}>
      {config.label}
    </span>
  );
}

export function PostReviewBadge({ status }: { status?: 'Pendente' | 'Em Análise' | 'Concluída' }) {
  if (!status) return null;
  const config: Record<string, { bg: string; text: string }> = {
    'Pendente': { bg: 'bg-warning/10', text: 'text-warning' },
    'Em Análise': { bg: 'bg-info/10', text: 'text-info' },
    'Concluída': { bg: 'bg-success/10', text: 'text-success' },
  };
  const c = config[status] || config['Pendente'];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${c.bg} ${c.text}`}>
      Pós-Revisão: {status}
    </span>
  );
}

export function ScopeBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-info/10 text-info ring-1 ring-info/20">
      {label}
    </span>
  );
}

export function AlertBadge({ label, variant = 'warning' }: { label: string; variant?: 'warning' | 'destructive' | 'info' }) {
  const styles = {
    warning: 'bg-warning/10 text-warning ring-1 ring-warning/20',
    destructive: 'bg-destructive/10 text-destructive ring-1 ring-destructive/20',
    info: 'bg-info/10 text-info ring-1 ring-info/20',
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold ${styles[variant]}`}>
      {label}
    </span>
  );
}
